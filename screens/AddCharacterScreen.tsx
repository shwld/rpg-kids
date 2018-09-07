import React from 'react'
import { NavigationScreenProp } from 'react-navigation'
import { compose } from 'react-apollo'
import styles from '../styles'
import { Content } from 'native-base'
import { uploadToFireStorage, generatePublicMediaUrl } from '../lib/firebase'
import CharacterForm, { State as formData } from '../components/CharacterForm'
import { profileImagePath } from '../lib/utils/imageHelper'
import { Query, Graphql } from '../graphql/screens/AddCharacter'
import { trackEvent } from '../lib/analytics'

interface Props {
  navigation: NavigationScreenProp<any, any>
  addCharacter(payload: { variables: {name, birthday, description}, update: any })
  editCharacter(payload: { variables: {id, imageUrl}, update: any })
  setInProgress(payload: { variables: {inProgress: boolean}})
  selectCharacter(payload: { variables: {characterId: string}})
}

const updateCache = (store, result, getCharacter) => {
  const data = store.readQuery({ query: Query.GetUser })
  data.user.characters.edges = [
    { node: getCharacter(result), __typename: 'CharacterEdge' },
    ...data.user.characters.edges
  ]
  store.writeQuery({ query: Query.GetUser, data })
}

const onAddCharacter = (store, result) => updateCache(store, result, result => result.data.addCharacter.character)
const onEditCharacter = (store, result) => updateCache(store, result, result => result.data.editCharacter.character)

const save = async (props: Props, data: formData) => {
  trackEvent('AddCharacter: save')
  const { navigation, addCharacter, editCharacter, setInProgress, selectCharacter } = props
  setInProgress({variables: { inProgress: true }})
  try {
    const { name, birthday, description, imageUri } = data
    const result = await addCharacter({
      variables: {
        name: name.value,
        birthday: birthday.value,
        description: description.value,
      },
      update: onAddCharacter,
    })
    const characterId = result.data.addCharacter.character.id
    const imagePath = profileImagePath(characterId)
    if (imageUri) {
      await uploadToFireStorage(imageUri, imagePath)
      await editCharacter({
        variables: {
          id: characterId,
          imageUrl: generatePublicMediaUrl(imagePath),
        },
        update: onEditCharacter,
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
  Graphql.EditCharacter(),
  Graphql.SetInProgress(),
  Graphql.SelectCharacter(),
)((props: Props) => (
  <Content contentContainerStyle={styles.stretch}>
    <CharacterForm save={(data: formData) => save(props, data)} />
  </Content>
))
