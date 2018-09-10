import React from 'react'
import styles from '../styles'
import {
  Button,
  Text,
  Card,
  CardItem,
  Body,
  Icon,
} from 'native-base'
import { TextInput, DateInput, InputString, InputDate } from '../components/Forms'
import imagePicker from '../lib/nativeHelpers/imagePicker'
import CharacterIcon from './CharacterIcon'
import toDate from '../lib/utils/toDate'
import { Character } from '../graphql/types'

interface Props {
  defaultValues?: Character
  save(data: State): void
}

const getDefaultValue = (props: Props, propName: string, defaultValue: any = '') => {
  if (props.defaultValues) {
    return props.defaultValues[propName]
  }
  return defaultValue
}

export interface State {
  name: InputString
  birthday: InputDate
  description: InputString
  imageUri: string
}

export default class extends React.Component<Props, State> {
  state: State = {
    name: {
      value: getDefaultValue(this.props, 'name'),
      validate: value => (value.trim() !== ''),
    },
    birthday: {
      value: toDate(getDefaultValue(this.props, 'birthday', new Date())),
      validate: value => (value ? true : false),
    },
    description: {
      value: getDefaultValue(this.props, 'description'),
      validate: value => (value.trim() !== ''),
    },
    imageUri: getDefaultValue(this.props, 'imageUrl', null),
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

  save() {
    if (!this.valid()) { return }
    this.props.save(this.state)
  }

  render() {
    return (
      <Card>
        <CardItem
          button
          onPress={() => imagePicker(uri => this.setState({imageUri: uri}))}
        >
          <Body style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ddd', padding: 20}}>
            {!this.state.imageUri && (
              <Icon name='camera' />
            )}
            {this.state.imageUri && (
              <CharacterIcon uri={this.state.imageUri} />
            )}
          </Body>
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
            <Text note>登録した内容は全員に公開されます。</Text>
            <Button block onPress={() => this.save()} >
              <Text>登録</Text>
            </Button>
          </Body>
        </CardItem>
        {this.props.children}
      </Card>
    )
  }
}
