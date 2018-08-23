import React from "react"
import { AppLoading } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import styles from '../styles'
import { Content } from "native-base"
import { Query, compose, graphql } from 'react-apollo'
import { SET_IN_PROGRESS } from '../graphql/mutations'
import gql from 'graphql-tag'
import { GET_USER } from './MyStatusScreen'
import getParam from '../lib/utils/getParam'
import AcquirementForm, { State as formData } from '../components/AcquirementForm'
import isEmpty from '../lib/utils/isEmpty'
import { Data, Character } from '../graphql/types'

interface Props {
  characterId: string
  navigation: NavigationScreenProp<any, any>
  editAcquirement(payload: { variables: {id: string, characterId: string, name: string, acquiredAt: Date}, update: any })
  setInProgress(payload: { variables: {inProgress: boolean}})
}

const EDIT_ACQUIREMENT = gql`
mutation EditAcquirement($id:ID!, $characterId: String!, $name:String!, $acquiredAt:DateTime!) {
  editAcquirement(id: $id, characterId: $characterId, name: $name, acquiredAt: $acquiredAt) {
    acquirement {
      id
      name
      acquiredAt
    }
    errors
  }
}
`

interface GetAcquirementType extends Data {
  character: Character
}
interface Variables {
  id: string
  characterId: string
}
class GetAcquirement extends Query<GetAcquirementType, Variables> {}
const GET_ACQUIREMENT = gql`
query GetAcquirement($id:ID!, $characterId:ID!) {
  character(id: $characterId) {
    id
    name
    birthday
    description
    acquirement(id: $id) {
      id
      name
      acquiredAt
    }
  }
}
`

const save = async (props: Props, data: formData) => {
  const { navigation, editAcquirement, setInProgress } = props
  const characterId = getParam({navigation}, 'characterId')
  const acquirementId = getParam({navigation}, 'acquirementId')
  setInProgress({variables: { inProgress: true }})
  try {
    const { name, acquiredAt } = data
    await editAcquirement({
      variables: {
        id: acquirementId,
        characterId,
        name: name.value,
        acquiredAt: acquiredAt.value,
      },
      update: (store, result) => {
        const data = store.readQuery({ query: GET_USER })
        const character = data.user.characters.edges.map(it => it.node).find(it => it.id === characterId)
        const acquirement = character.acquirements.edges.find(it => it.node.id === acquirementId)
        if (acquirement) {
          acquirement.node = result.data.editAcquirement.acquirement
        }
        store.writeQuery({ query: GET_USER, data })
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
    <GetAcquirement
      query={GET_ACQUIREMENT}
      variables={{
        id: getParam(props, 'acquirementId'),
        characterId: getParam(props, 'characterId'),
      }}
      fetchPolicy="cache-and-network"
    >
      {({data}) => {
        if (isEmpty(data) || !data || data.loading) {
          return <AppLoading />
        }
        return (
          <AcquirementForm
            save={(data: formData) => save(props, data)}
            defaultValues={data.character.acquirement}
          />
        )
      }}
    </GetAcquirement>
  </Content>
)

export default compose(
  graphql(EDIT_ACQUIREMENT, { name: 'editAcquirement' }),
  graphql(SET_IN_PROGRESS, { name: 'setInProgress' }),
)(Screen)
