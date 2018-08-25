import React from 'react'
import { NavigationScreenProp } from 'react-navigation'
import { compose } from 'react-apollo'
import styles from '../styles'
import { Content } from 'native-base'
import { uploadToFireStorage, generatePublicMediaUrl } from '../lib/firebase'
import CharacterForm, { State as formData } from '../components/CharacterForm'
import { profileImagePath } from '../lib/utils/imageHelper'
import { Query, Graphql } from '../graphql/screens/AddCharacter'

interface Props {
  navigation: NavigationScreenProp<any, any>
  addCharacter(payload: { variables: {name, birthday, description}, update: any })
  updateImageUrl(payload: { variables: {id, imageUrl}, update: any })
  setInProgress(payload: { variables: {inProgress: boolean}})
  selectCharacter(payload: { variables: {characterId: string}})
}

const updateCache = (store, result) => {
  const data = store.readQuery({ query: Query.GetUser })
  data.user.characters.edges = [
    { node: result.data.addCharacter.character, __typename: 'CharacterEdge' },
    ...data.user.characters.edges
  ]
  store.writeQuery({ query: Query.GetUser, data })
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

export default compose(
  Graphql.AddCharacter(),
  Graphql.UpdateImageUrl(),
  Graphql.SetInProgress(),
  Graphql.SelectCharacter(),
)((props: Props) => (
  <Content contentContainerStyle={styles.stretch}>
    <CharacterForm save={(data: formData) => save(props, data)} />
  </Content>
))
