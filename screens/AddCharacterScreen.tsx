import React from 'react'
import { NavigationScreenProp } from 'react-navigation'
import { compose, graphql } from 'react-apollo'
import { SET_IN_PROGRESS } from '../graphql/mutations'
import gql from 'graphql-tag'
import styles from '../styles'
import { Content } from 'native-base'
import { Query as MyStatusQuery } from '../graphql/screens/MyStatus'
import { uploadToFireStorage, generatePublicMediaUrl } from '../lib/firebase'
import CharacterForm, { State as formData } from '../components/CharacterForm'
import { SELECT_CHARACTER } from '../graphql/mutations'
import { profileImagePath } from '../lib/utils/imageHelper'

interface Props {
  navigation: NavigationScreenProp<any, any>
  addCharacter(payload: { variables: {name, birthday, description}, update: any })
  updateImageUrl(payload: { variables: {id, imageUrl}, update: any })
  setInProgress(payload: { variables: {inProgress: boolean}})
  selectCharacter(payload: { variables: {characterId: string}})
}

const ADD_CHARACTER = gql`
mutation addCharacter($name:String = "", $birthday:DateTime = "2000/1/1", $description:String = "") {
  addCharacter(name: $name, birthday: $birthday, description: $description) {
    character {
      id
      name
      birthday
      description
      acquirements(first: 5) {
        edges {
          node {
            id
            name
            acquiredAt
          }
        }
      }
    }
    errors
  }
}
`

const UPDATE_IMAGE_URL = gql`
mutation editCharacter($id:ID!, $imageUrl:String = null) {
  editCharacter(id: $id, imageUrl: $imageUrl) {
    character {
      id
      name
      birthday
      description
      imageUrl
      acquirements(first: 5) {
        edges {
          node {
            id
            name
            acquiredAt
          }
        }
      }
    }
    errors
  }
}
`

const updateCache = (store, result) => {
  const data = store.readQuery({ query: MyStatusQuery.GetUser })
  data.user.characters.edges = [
    { node: result.data.addCharacter.character, __typename: 'CharacterEdge' },
    ...data.user.characters.edges
  ]
  store.writeQuery({ query: MyStatusQuery.GetUser, data })
}

const save = async (props: Props, data: formData) => {
  const { navigation, addCharacter, updateImageUrl, setInProgress, selectCharacter } = props
  setInProgress({variables: { inProgress: true }})
  try {
    const { name, birthday, description, imageUri } = data
    const result = await addCharacter({
      variables: {
        name: name.value,
        birthday: birthday.value,
        description: description.value,
      },
      update: updateCache,
    })
    const characterId = result.data.addCharacter.character.id
    const imagePath = profileImagePath(characterId)
    if (imageUri) {
      await uploadToFireStorage(imageUri, imagePath)
      await updateImageUrl({
        variables: {
          id: characterId,
          imageUrl: generatePublicMediaUrl(imagePath),
        },
        update: updateCache,
      })
    }
    await selectCharacter({variables: { characterId }})
    navigation.replace('MyStatus')
  } catch (e) {
    throw e
  } finally {
    setInProgress({variables: { inProgress: false }})
  }
}

const Screen = (props: Props) => (
  <Content contentContainerStyle={styles.stretch}>
    <CharacterForm save={(data: formData) => save(props, data)} />
  </Content>

)

export default compose(
  graphql(ADD_CHARACTER, { name: 'addCharacter'}),
  graphql(UPDATE_IMAGE_URL, { name: 'updateImageUrl'}),
  graphql(SET_IN_PROGRESS, { name: 'setInProgress'}),
  graphql(SELECT_CHARACTER, { name: 'selectCharacter'}),
)(Screen)
