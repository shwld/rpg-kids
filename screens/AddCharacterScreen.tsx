import React from 'react'
import { NavigationScreenProp } from 'react-navigation'
import { compose } from 'react-apollo'
import { Content } from 'native-base'
import { uploadToFireStorage, generatePublicMediaUrl } from '../lib/firebase'
import CharacterForm, { State as formData } from '../components/CharacterForm'
import { profileImagePath } from '../lib/utils/imageHelper'
import { Graphql, MutateCallbacks } from '../graphql/screens/AddCharacter'
import { trackEvent } from '../lib/analytics'
import formatFromDate from '../lib/utils/formatFromDate'


interface Props {
  navigation: NavigationScreenProp<any, any>
  addCharacter(payload: { variables: {name, birthday, description}, update: any })
  editCharacter(payload: { variables: {id, imageUrl} })
  selectCharacter(payload: { variables: {characterId: string}})
}


const save = async (props: Props, data: formData) => {
  trackEvent('AddCharacter: save')
  const { addCharacter, editCharacter, selectCharacter } = props
  const { name, birthday, description, imageUri } = data
  const result = await addCharacter({
    variables: {
      name: name.value,
      birthday: formatFromDate(birthday.value, 'YYYY/MM/DD'),
      description: description.value,
    },
    ...MutateCallbacks.AddCharacter(),
  })
  const characterId = result.data.addCharacter.character.id
  const imagePath = profileImagePath(characterId)
  if (imageUri) {
    await uploadToFireStorage(imageUri, imagePath)
    await editCharacter({
      variables: {
        id: characterId,
        imageUrl: generatePublicMediaUrl(imagePath, new Date()),
      },
    })
  }
  await selectCharacter({variables: { characterId }})
}

export default compose(
  Graphql.AddCharacter(),
  Graphql.EditCharacter(),
  Graphql.SelectCharacter(),
)((props: Props) => (
  <Content>
    <CharacterForm
      save={(data: formData) => save(props, data)}
      handleSaveComplate={() => props.navigation.popToTop()}
    />
  </Content>
))
