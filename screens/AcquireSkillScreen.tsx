import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import { Content } from "native-base"
import { compose } from 'react-apollo'
import { Query as MyStatusQuery } from '../graphql/screens/MyStatus'
import { Query as FlowQuery } from '../graphql/screens/Flow'
import getParam from '../lib/utils/getParam'
import AcquirementForm, { State as formData } from '../components/AcquirementForm'
import { Graphql } from '../graphql/screens/AcquireSkill'
import { trackEvent } from '../lib/analytics'

interface Props {
  characterId: string
  navigation: NavigationScreenProp<any, any>
  acquireSkill(payload: { variables: {characterId: string, name: string, acquiredAt: Date}, refetchQueries: any, update: any })
  setInProgress(payload: { variables: {inProgress: boolean}})
}


const save = async (props: Props, data: formData) => {
  trackEvent('AcquireSkill: save')
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
      refetchQueries: [{
        query: FlowQuery.GetAcquirements,
        variables: { repoName: 'apollographql/apollo-client' },
      }],
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

export default compose(
  Graphql.AcquireSkill(),
  Graphql.SetInProgress(),
)((props: Props) => (
  <Content>
    <AcquirementForm save={(data: formData) => save(props, data)} />
  </Content>
))
