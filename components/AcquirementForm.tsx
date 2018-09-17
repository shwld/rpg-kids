import React from "react"
import styles from '../styles'
import {
  Card,
  CardItem,
  Body,
  Button,
  Text,
  Toast,
} from 'native-base'
import { TextInput, DateInput, InputString, InputDate } from '../components/Forms'
import toDate from '../lib/utils/toDate'

interface Props {
  defaultValues?: {
    name: string
    acquiredAt: string|Date
  }
  save(data: State): void
  handleSaveComplate(): void
}

export interface State {
  inProgress: boolean
  name: InputString
  acquiredAt: InputDate
}

const getDefaultValue = (props: Props, propName: string, defaultValue: any = '') => {
  if (props.defaultValues) {
    return props.defaultValues[propName]
  }
  return defaultValue
}

export default class extends React.Component<Props, State> {
  state: State = {
    inProgress: false,
    name: {
      value: getDefaultValue(this.props, 'name'),
      validate: value => (value.trim() !== ''),
    },
    acquiredAt: {
      value: toDate(getDefaultValue(this.props, 'acquiredAt', new Date())),
      validate: value => (value ? true : false),
    },
  }

  valid() {
    this.setState({name: {...this.state.name, isDirty: true}})
    this.setState({acquiredAt: {...this.state.acquiredAt, isDirty: true}})

    const results: boolean[] = [
      this.state.name.validate(this.state.name.value),
      this.state.acquiredAt.validate(this.state.acquiredAt.value),
    ]
    return results.every(x => x)
  }

  async save() {
    if (!this.valid()) {
      Toast.show({
        text: '入力内容に誤りがあります',
        buttonText: 'OK',
        duration: 3000,
        position: 'top',
        type: 'warning',
      })
      return
    }
    this.setState({inProgress: true})
    try {
      await this.props.save(this.state)
    } finally {
      this.setState({inProgress: false})
    }
    Toast.show({
      text: '登録しました',
      buttonText: 'OK',
      duration: 3000,
      position: 'top',
      type: 'success',
    })
    this.props.handleSaveComplate()
  }

  render() {
    return (
      <Card>
        <CardItem>
          <Body style={styles.stretch}>
            <TextInput
              label='できたこと'
              onChange={name => this.setState({name})}
              item={this.state.name}
            />
            <DateInput 
              label='できた日'
              onChange={acquiredAt => this.setState({acquiredAt})}
              item={this.state.acquiredAt}
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
