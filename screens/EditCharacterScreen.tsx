import React from 'react'
import { AppLoading } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import { compose } from 'react-apollo'
import { Content } from 'native-base'
import { uploadToFireStorage, generatePublicMediaUrl } from '../lib/firebase'
import CharacterForm, { State as formData } from '../components/CharacterForm'
import isEmpty from '../lib/utils/isEmpty'
import getParam from '../lib/utils/getParam'
import { profileImagePath } from '../lib/utils/imageHelper'
import { Component, Query, Graphql } from '../graphql/screens/EditCharacter'
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
        selectCharacter({ variables: { characterId }})
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

const Screen = (props: Props) => (
  <Content>
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
          />
        )
      }}
    </Component.GetCharacter>
  </Content>

)

export default compose(
  Graphql.EditCharacter(),
  Graphql.SetInProgress(),
  Graphql.SelectCharacter(),
)(Screen)
