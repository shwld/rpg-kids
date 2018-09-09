import React from 'react'
import { AppLoading } from 'expo'
import { Alert } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { compose } from 'react-apollo'
import styles from '../styles'
import { Content, CardItem, Body, Button, Text } from 'native-base'
import { uploadToFireStorage, generatePublicMediaUrl } from '../lib/firebase'
import CharacterForm, { State as formData } from '../components/CharacterForm'
import isEmpty from '../lib/utils/isEmpty'
import getParam from '../lib/utils/getParam'
import { profileImagePath } from '../lib/utils/imageHelper'
import { Component, Query, Graphql } from '../graphql/screens/EditCharacter'
import { Query as FlowQuery } from '../graphql/screens/Flow'
import { trackEvent } from '../lib/analytics'


interface Props {
  characterId: string
  navigation: NavigationScreenProp<any, any>
  editCharacter(payload: { variables: {id, name, birthday, description, imageUrl} , update: any})
  removeCharacter(payload: { variables: {id: string}, refetchQueries: any, update: any })
  setInProgress(payload: { variables: {inProgress: boolean}})
  selectCharacter(payload: { variables: {characterId: string}})
}

const save = async (props: Props, values: formData) => {
  trackEvent('EditCharacter: save')
  const characterId = getParam(props, 'characterId')
  const { navigation, editCharacter, setInProgress, selectCharacter } = props
  setInProgress({variables: { inProgress: true }})
  try {
    const { name, birthday, description, imageUri } = values
    const imagePath = profileImagePath(characterId)
    await editCharacter({
      variables: {
        id: characterId,
        name: name.value,
        birthday: birthday.value,
        description: description.value,
        imageUrl: imageUri ? generatePublicMediaUrl(imagePath) : null,
      },
      update: (store, result) => {
        const data = store.readQuery({ query: Query.GetUser })
        let character = data.user.characters.edges.find(it => it.node.id === characterId)
        if (character.node) {
          character.node = result.data.editCharacter.character
        }
        store.writeQuery({ query: Query.GetUser, data })
        selectCharacter({variables: { characterId }})
      },
    })
    if (imageUri) {
      await uploadToFireStorage(imageUri, imagePath)
    }
    navigation.pop()
  } catch (e) {
    throw e
  } finally {
    setInProgress({variables: { inProgress: false }})
  }
}

const remove = async (props: Props) => {
  trackEvent('EditCharacter: remove')
  const characterId = getParam(props, 'characterId')
  const { navigation, removeCharacter, setInProgress } = props
  setInProgress({variables: { inProgress: true }})
  try {
    await removeCharacter({
      variables: { id: characterId },
      refetchQueries: [{
        query: FlowQuery.GetAcquirements,
        variables: { repoName: 'apollographql/apollo-client' },
      }],
      update: (store, result) => {
        const data = store.readQuery({ query: Query.GetUser })
        data.user = result.data.removeCharacter.user
        store.writeQuery({ query: Query.GetUser, data })
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
    <Component.GetCharacter
      query={Query.GetCharacter}
      variables={{id: getParam(props, 'characterId')}}
      fetchPolicy="cache-and-network"
    >
      {({data, loading}) => {
        if (isEmpty(data) || !data || loading) {
          return <AppLoading />
        }
        return (
          <CharacterForm
            save={(values: formData) => save(props, values)}
            defaultValues={data.character}
          >
            <CardItem>
              <Body style={styles.stretch}>
                <Button danger block onPress={() => {
                  Alert.alert(
                    '子供の情報を削除します',
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
          </CharacterForm>
        )
      }}
    </Component.GetCharacter>
  </Content>

)

export default compose(
  Graphql.EditCharacter(),
  Graphql.RemoveCharacter(),
  Graphql.SetInProgress(),
  Graphql.SelectCharacter(),
)(Screen)
