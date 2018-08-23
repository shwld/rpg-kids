import React from "react"
import { Alert } from 'react-native'
import { AppLoading } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import styles from '../styles'
import { Content, CardItem, Body, Button, Text } from 'native-base'
import { Query, compose, graphql } from 'react-apollo'
import { SET_IN_PROGRESS } from '../graphql/mutations'
import gql from 'graphql-tag'
import { Query as MyStatusQuery, Getter as MyStatusGetter } from '../graphql/screens/MyStatus'
import getParam from '../lib/utils/getParam'
import AcquirementForm, { State as formData } from '../components/AcquirementForm'
import isEmpty from '../lib/utils/isEmpty'
import { Data, Character } from '../graphql/types'
import { GET_CHARACTER } from './LogScreen'

interface Props {
  characterId: string
  navigation: NavigationScreenProp<any, any>
  editAcquirement(payload: { variables: {id: string, characterId: string, name: string, acquiredAt: Date}, update: any })
  removeAcquirement(payload: { variables: {id: string, characterId: string}, update: any })
  setInProgress(payload: { variables: {inProgress: boolean}})
}

const EDIT_ACQUIREMENT = gql`
mutation EditAcquirement($id:ID!, $characterId: ID!, $name:String!, $acquiredAt:DateTime!) {
  editAcquirement(id: $id, characterId: $characterId, name: $name, acquiredAt: $acquiredAt) {
    acquirement {
      id
      name
      acquiredAt
      skillId
    }
    errors
  }
}
`

const REMOVE_ACQUIREMENT = gql`
mutation RemoveAcquirement($id:ID!, $characterId:ID!) {
  removeAcquirement(characterId: $characterId, id: $id) {
    character {
      id
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

const updateAcquirement = (store, character, updatedAcquirement) => {
  if (!character) { return }
  const acquirement = character.acquirements.edges.find(it => it.node.id === updatedAcquirement.id)
  if (!acquirement) { return }
  acquirement.node = updatedAcquirement
  return character
}

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
        const acquirement = result.data.editAcquirement.acquirement

        let data = store.readQuery({ query: MyStatusQuery.GetUser })
        const character = MyStatusGetter.getCharacter(data, characterId)
        updateAcquirement(store, character, acquirement)
        store.writeQuery({ query: MyStatusQuery.GetUser, data })

        data = store.readQuery({ query: GET_CHARACTER, variables: {id:characterId, cursor: null} })
        updateAcquirement(store, data.character, acquirement)
        store.writeQuery({ query: GET_CHARACTER, data })
      },
    })
    navigation.pop()
  } catch (e) {
    throw e
  } finally {
    setInProgress({variables: { inProgress: false }})
  }
}

const remove = async (props: Props) => {
  const { navigation, removeAcquirement, setInProgress } = props
  const characterId = getParam({navigation}, 'characterId')
  const acquirementId = getParam({navigation}, 'acquirementId')
  setInProgress({variables: { inProgress: true }})
  try {
    await removeAcquirement({
      variables: {
        id: acquirementId,
        characterId,
      },
      update: (store) => {
        let data = store.readQuery({ query: MyStatusQuery.GetUser })
        const character = MyStatusGetter.getCharacter(data, characterId)
        if (!character) { return }
        let acquirementsEdges = character.acquirements.edges.filter(it => it.node.id !== acquirementId)
        character.acquirements.edges = acquirementsEdges
        store.writeQuery({ query: MyStatusQuery.GetUser, data })

        data = store.readQuery({ query: GET_CHARACTER, variables: {id:characterId, cursor: null} })
        if (!data.character) { return }
        acquirementsEdges = data.character.acquirements.edges.filter(it => it.node.id !== acquirementId)
        data.character.acquirements.edges = acquirementsEdges
        store.writeQuery({ query: GET_CHARACTER, data })
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
          >
            <CardItem>
              <Body style={styles.stretch}>
                <Button danger block onPress={() => {
                  Alert.alert(
                    '削除します',
                    'よろしいですか?',
                    [
                      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                      {text: 'OK', onPress: () => remove(props)},
                    ],
                  )
                }} >
                  <Text>削除</Text>
                </Button>
              </Body>
            </CardItem>
          </AcquirementForm>
        )
      }}
    </GetAcquirement>
  </Content>
)

export default compose(
  graphql(EDIT_ACQUIREMENT, { name: 'editAcquirement' }),
  graphql(REMOVE_ACQUIREMENT, { name: 'removeAcquirement' }),
  graphql(SET_IN_PROGRESS, { name: 'setInProgress' }),
)(Screen)
