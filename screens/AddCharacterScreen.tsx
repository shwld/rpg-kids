import React from 'react';
import { Permissions, ImagePicker } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import firebase from '../lib/firebase'
import { graphql } from 'react-apollo'
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
  ActionSheet,
} from 'native-base';
import { TextInput, DateInput, InputString, InputDate } from '../components/Forms'

interface Props {
  navigation: NavigationScreenProp<any, any>
  addCharacter(payload: { variables: {name, birthday, description} })
}

interface State {
  name: InputString
  birthday: InputDate
  description: InputString
  imageUri: string
}

const ADD_CHARACTER = gql`
mutation addCharacter($name:String = "", $birthday:DateTime = "2000/1/1", $description:String = "") {
  createCharacter(name: $name, birthday: $birthday, description: $description) {
    character {
      id
      name
      birthday
      description
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
    const results: boolean[] = []
    results.push(this.state.name.validate(this.state.name.value))
    this.setState({name: {...this.state.name, isDirty: true}})
    results.push(this.state.birthday.validate(this.state.birthday.value))
    this.setState({birthday: {...this.state.birthday, isDirty: true}})
    results.push(this.state.description.validate(this.state.description.value))
    this.setState({description: {...this.state.description, isDirty: true}})
    return results.every(x => x)
  }

  async save() {
    const { navigation, addCharacter } = this.props
    if (!this.valid()) { return }
    const { name, birthday, description } = this.state
    const result = await addCharacter({
      variables: {
        name: name.value,
        birthday: birthday.value,
        description: description.value,
      },
    })
    await this.uploadImage(this.state.imageUri, result.data.createCharacter.character.id)
    navigation.replace('Status')
  }

  async uploadImage(imageUri: string, characterId: string) {
    const response = await fetch(imageUri)
    const blob = await response.blob()
    const metadata = {
      contentType: 'image/jpeg',
    }
    const ref = firebase.storage().ref(`characters/${characterId}/profile.jpg`)
    const snapshot = await ref.put(blob, metadata)
    console.log(snapshot)
    console.log(ref.fullPath)
  }

  async permit(type) {
    await Permissions.askAsync(type)
    const { status } = await Permissions.getAsync(type)
    return status === 'granted'
  }

  async takeImage() {
    const canCamera = await this.permit(Permissions.CAMERA)
    if (!canCamera) { return }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      quality: 0.3,
      exif: false,
    })
    this._handleImagePicked(result)
  }

  async pickImage() {
    const canCameraRoll = await this.permit(Permissions.CAMERA_ROLL)
    if (!canCameraRoll) { return }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      quality: 0.3,
      exif: false,
    });
    this._handleImagePicked(result)
  }

  async _handleImagePicked(pickerResult) {
    if (!pickerResult.cancelled) {
      this.setState({imageUri: pickerResult.uri});
    }
  }

  getImageSource() {
    if (this.state.imageUri) {
      return { uri: this.state.imageUri }
    }
    return require('../assets/baby_asia_boy.png')
  }

  takeOrPickPicture() {
    ActionSheet.show(
      {
        options: [
          { text: 'カメラ', icon: 'camera', iconColor: '#2c8ef4' },
          { text: 'カメラロール', icon: 'file', iconColor: '#f42ced' },
          { text: 'キャンセル', icon: 'close', iconColor: '#25de5b' }
        ],
        cancelButtonIndex: 2,
        title: '写真をアップロード',
      },
      buttonIndex => {
        switch(buttonIndex) {
          case 0:
            return this.takeImage()
          case 1:
            return this.pickImage()
          default:
            return
        }
      }
    )
  }

  render() {
    return (
      <Content contentContainerStyle={styles.stretch}>
        <Card>
          <CardItem button onPress={() => this.takeOrPickPicture()} >
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

export default graphql<Props>(ADD_CHARACTER,
  { name: 'addCharacter'}
)(AddCharacterForm)
