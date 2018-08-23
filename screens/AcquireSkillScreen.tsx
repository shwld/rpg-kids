import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import styles from '../styles'
import { Content } from "native-base"
import { compose, graphql } from 'react-apollo'
import { SET_IN_PROGRESS } from '../graphql/mutations'
import gql from 'graphql-tag'
import { Query as MyStatusQuery } from '../graphql/screens/MyStatus'
import getParam from '../lib/utils/getParam'
import AcquirementForm, { State as formData } from '../components/AcquirementForm'

interface Props {
  characterId: string
  navigation: NavigationScreenProp<any, any>
  acquireSkill(payload: { variables: {characterId: string, name: string, acquiredAt: Date}, update: any })
  setInProgress(payload: { variables: {inProgress: boolean}})
}

const ACQUIRE_SKILL = gql`
mutation AcquireSkill($characterId: ID!, $name:String!, $acquiredAt:DateTime!) {
  acquireSkill(characterId: $characterId, name: $name, acquiredAt: $acquiredAt) {
    acquirement {
      id
      name
      acquiredAt
    }
    errors
  }
}
`

const save = async (props: Props, data: formData) => {
  const { navigation, acquireSkill, setInProgress } = props
  const characterId = getParam({navigation}, 'characterId')
  setInProgress({variables: { inProgress: true }})
  try {
    const { name, acquiredAt } = data
    await acquireSkill({
      variables: {
        characterId,
        name: name.value,
        acquiredAt: acquiredAt.value,
      },
      update: (store, result) => {
        const data = store.readQuery({ query: MyStatusQuery.GetUser })
        const character = data.user.characters.edges.map(it => it.node).find(it => it.id === characterId)
        if (!character) { return }
        character.acquirements.edges = [
          { node: result.data.acquireSkill.acquirement, __typename: 'AcquirementEdge' },
          ...character.acquirements.edges
        ]
        store.writeQuery({ query: MyStatusQuery.GetUser, data })
      },
    })
    navigation.pop()
  } catch (e) {
    throw e
  } finally {
    setInProgress({variables: { inProgress: false }})
  }
}

const Screen = (props: Props) => (
  <Content contentContainerStyle={styles.stretch}>
    <AcquirementForm save={(data: formData) => save(props, data)} />
  </Content>
)

export default compose(
  graphql(ACQUIRE_SKILL, { name: 'acquireSkill' }),
  graphql(SET_IN_PROGRESS, { name: 'setInProgress' }),
)(Screen)
