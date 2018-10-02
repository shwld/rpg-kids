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
import Toast from '../lib/Toast'

interface Props {
  defaultValues?: Character
  save(data: State): void
  handleSaveComplate(): void
}

const getDefaultValue = (props: Props, propName: string, defaultValue: any = '') => {
  if (props.defaultValues) {
    return props.defaultValues[propName]
  }
  return defaultValue
}

export interface State {
  inProgress: boolean
  name: InputString
  birthday: InputDate
  description: InputString
  imageUri: string
}

export default class extends React.Component<Props, State> {
  state: State = {
    inProgress: false,
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

  async save() {
    if (!this.valid()) {
      Toast.warning('入力内容に誤りがあります')
      return
    }
    this.setState({inProgress: true})
    try {
      await this.props.save(this.state)
    } finally {
      this.setState({inProgress: false})
    }
    Toast.success('登録しました')
    this.props.handleSaveComplate()
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
            {(this.props.defaultValues && this.props.defaultValues.imageUrl) && (
              <Text note style={{marginTop: 20}}>画像の変更は、保存後画面への反映までに時間がかかることがありますのでご注意ください</Text>
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
            <Button block disabled={this.state.inProgress} onPress={() => this.save()} >
              <Text>{this.state.inProgress ? '登録しています...' : '登録'}</Text>
            </Button>
          </Body>
        </CardItem>
        {this.props.children}
      </Card>
    )
  }
}
