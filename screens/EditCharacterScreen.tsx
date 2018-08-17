import React from 'react'
import { AppLoading } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import { compose, graphql, Query } from 'react-apollo'
import { SET_IN_PROGRESS } from '../graphql/mutations'
import gql from 'graphql-tag'
import styles from '../styles'
import { Content } from 'native-base'
import { GET_USER } from './MyStatusScreen'
import { uploadToFireStorage, generatePublicMediaUrl } from '../lib/firebase'
import CharacterForm, { State as formData } from '../components/CharacterForm'
import { SELECT_CHARACTER } from '../graphql/mutations'
import isEmpty from '../lib/utils/isEmpty'
import getParam from '../lib/utils/getParam'
import { profileImagePath } from '../lib/utils/imageHelper'

interface Props {
  characterId: string
  navigation: NavigationScreenProp<any, any>
  editCharacter(payload: { variables: {id, name, birthday, description, imageUrl}, update: any })
  setInProgress(payload: { variables: {inProgress: boolean}})
  selectCharacter(payload: { variables: {characterId: string}})
}

const EDIT_CHARACTER = gql`
mutation editCharacter($id:ID!, $name:String = null, $birthday:DateTime = null, $description:String = null, $imageUrl:String = null) {
  editCharacter(id: $id, name: $name, birthday: $birthday, description: $description, imageUrl: $imageUrl) {
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

const GET_CHARACTER = gql`
query GetCharacter($id:ID = "") {
  character(id: $id) {
    id
    name
    birthday
    description
  }
}
`

const save = async (props: Props, values: formData) => {
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
        const data = store.readQuery({ query: GET_USER });
        let character = data.user.characters.edges.find(it => it.node.id === characterId)
        if (character.node) {
          character.node = result.data.editCharacter.character
        }
        store.writeQuery({ query: GET_USER, data });
        selectCharacter({variables: { characterId }})
      },
    })
    if (imageUri) {
      await uploadToFireStorage(imageUri, imagePath)
    }
    navigation.replace('MyStatus')
  } catch (e) {
    throw e
  } finally {
    setInProgress({variables: { inProgress: false }})
  }
}

const Screen = (props: Props) => (
  <Content contentContainerStyle={styles.stretch}>
    <Query query={GET_CHARACTER} variables={{id: getParam(props, 'characterId')}} fetchPolicy="cache-and-network">
      {({data}) => {
        if (isEmpty(data) || data.loading) {
          return <AppLoading />
        }
        return <CharacterForm
          save={(values: formData) => save(props, values)}
          defaultValues={data.character}
        />
      }}
    </Query>
  </Content>

)

export default compose(
  graphql(EDIT_CHARACTER, { name: 'editCharacter'}),
  graphql(SET_IN_PROGRESS, { name: 'setInProgress'}),
  graphql(SELECT_CHARACTER, { name: 'selectCharacter'}),
)(Screen)
