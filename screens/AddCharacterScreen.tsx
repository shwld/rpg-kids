import React from 'react';
import { NavigationScreenProp } from 'react-navigation'
import { compose, graphql } from 'react-apollo'
import { SET_IN_PROGRESS } from '../graphql/mutations'
import gql from 'graphql-tag'
import styles from '../styles'
import { Content } from 'native-base';
import { GET_USER } from './MyStatusScreen';
import { uploadToFireStorage } from '../lib/firebase'
import CharacterForm, { State as formData } from '../components/CharacterForm'
import { SELECT_CHARACTER } from '../graphql/mutations'

interface Props {
  navigation: NavigationScreenProp<any, any>
  addCharacter(payload: { variables: {name, birthday, description}, update: any })
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

const save = async (props: Props, data: formData) => {
  const { navigation, addCharacter, setInProgress, selectCharacter } = props
  setInProgress({variables: { inProgress: true }})
  try {
    const { name, birthday, description } = data
    const result = await addCharacter({
      variables: {
        name: name.value,
        birthday: birthday.value,
        description: description.value,
      },
      update: (store, result) => {
        const data = store.readQuery({ query: GET_USER });
        data.user.characters.edges = [
          { node: result.data.addCharacter.character, __typename: 'CharacterEdge' },
          ...data.user.characters.edges
        ]
        store.writeQuery({ query: GET_USER, data });
        selectCharacter({variables: { characterId: result.data.addCharacter.character.id }})
      },
    })
    if (data.imageUri) {
      await uploadToFireStorage(data.imageUri, `characters/${result.data.addCharacter.character.id}/profile.jpg`)
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
    <CharacterForm save={(data: formData) => save(props, data)} />
  </Content>

)

export default compose(
  graphql(ADD_CHARACTER, { name: 'addCharacter'}),
  graphql(SET_IN_PROGRESS, { name: 'setInProgress'}),
  graphql(SELECT_CHARACTER, { name: 'selectCharacter'}),
)(Screen)
