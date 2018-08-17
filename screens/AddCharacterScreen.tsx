import React from 'react';
import { NavigationScreenProp } from 'react-navigation'
import { compose, graphql } from 'react-apollo'
import { SET_IN_PROGRESS } from '../graphql/mutations'
import gql from 'graphql-tag'
import styles from '../styles'
import {
  Content,
  Button,
  Text,
  Card,
  CardItem,
  Body,
  Thumbnail,
} from 'native-base';
import { TextInput, DateInput, InputString, InputDate } from '../components/Forms'
import { GET_USER } from './MyStatusScreen';
import { uploadToFireStorage } from '../lib/firebase'
import imagePicker from '../lib/nativeHelpers/imagePicker'

interface Props {
  navigation: NavigationScreenProp<any, any>
  addCharacter(payload: { variables: {name, birthday, description}, update: any })
  setInProgress(payload: { variables: {inProgress: boolean}})
}

interface State {
  name: InputString
  birthday: InputDate
  description: InputString
  imageUri: string
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
`;

class AddCharacterForm extends React.Component<Props, State> {
  state: State = {
    name: {
      value: '',
      validate: value => (value.trim() !== ''),
    },
    birthday: {
      value: new Date(),
      validate: value => (value ? true : false),
    },
    description: {
      value: '',
      validate: value => (value.trim() !== ''),
    },
    imageUri: '',
  }

  valid() {
    this.setState({name: {...this.state.name, isDirty: true}})
    this.setState({birthday: {...this.state.birthday, isDirty: true}})
    this.setState({description: {...this.state.description, isDirty: true}})

    const results: boolean[] = [
      this.state.name.validate(this.state.name.value),
      this.state.birthday.validate(this.state.birthday.value),
      this.state.description.validate(this.state.description.value)
    ]
    return results.every(x => x)
  }

  async save() {
    const { navigation, addCharacter, setInProgress } = this.props
    setInProgress({variables: { inProgress: true }})
    try {
      if (!this.valid()) { return }
      const { name, birthday, description } = this.state
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
        },
      })
      if (this.state.imageUri) {
        await uploadToFireStorage(this.state.imageUri, `characters/${result.data.addCharacter.character.id}/profile.jpg`)
      }
      navigation.replace('MyStatus')
    } catch (e) {
      throw e
    } finally {
      setInProgress({variables: { inProgress: false }})
    }
  }

  getImageSource() {
    if (this.state.imageUri) {
      return { uri: this.state.imageUri }
    }
    return require('../assets/baby_asia_boy.png')
  }

  render() {
    return (
      <Content contentContainerStyle={styles.stretch}>
        <Card>
          <CardItem button onPress={() => imagePicker(uri => this.setState({imageUri: uri}))} >
            <Thumbnail
              source={this.getImageSource()}
              style={{marginRight: 20}}
            />
          </CardItem>
          <CardItem>
            <Body style={styles.stretch}>
              <TextInput
                label='名前'
                onChange={name => this.setState({name})}
                item={this.state.name}
              />
              <DateInput 
                label='誕生日'
                onChange={birthday => this.setState({birthday})}
                item={this.state.birthday}
              />
              <TextInput
                label='ひとこと'
                onChange={description => this.setState({description})}
                item={this.state.description}
              />
            </Body>
          </CardItem>
          <CardItem>
            <Body style={styles.stretch}>
              <Button block onPress={() => this.save()} >
                <Text>登録</Text>
              </Button>
            </Body>
          </CardItem>
        </Card>
      </Content>
    )
  }
}

export default compose(
  graphql(ADD_CHARACTER, { name: 'addCharacter'}),
  graphql(SET_IN_PROGRESS, { name: 'setInProgress'}),
)(AddCharacterForm)
