import React from "react"
import styles from '../styles'
import {
  Card,
  CardItem,
  Body,
  Button,
  Text,
} from 'native-base'
import TextInput, { InputString } from '../components/forms/TextInput'
import Toast from '../lib/Toast'

interface Props {
  defaultValues?: {
    email: string
    password: string
  }
  submit(data: State): void
  handleSubmitComplate(): void
  actionName?: string
}

export interface State {
  inProgress: boolean
  email: InputString
  password: InputString
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
    email: {
      value: getDefaultValue(this.props, 'email'),
      validate: value => (/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)),
    },
    password: {
      value: getDefaultValue(this.props, 'password'),
      validate: value => (value.trim() !== ''),
    },
  }

  valid() {
    this.setState({email: {...this.state.email, isDirty: true}})
    this.setState({password: {...this.state.password, isDirty: true}})

    const results: boolean[] = [
      this.state.email.validate(this.state.email.value),
      this.state.password.validate(this.state.password.value),
    ]
    return results.every(x => x)
  }

  async submit() {
    let { actionName } = this.props
    actionName = actionName || 'ログイン'

    if (!this.valid()) {
      Toast.warning('Emailまたはパスワードに問題があります')
      return
    }
    this.setState({inProgress: true})
    try {
      await this.props.submit(this.state)
      this.setState({inProgress: false})
    } catch(e) {
      Toast.warning('Emailまたはパスワードに問題があります')
      this.setState({inProgress: false})
      return
    }
    Toast.success(`${actionName}しました`)
    this.props.handleSubmitComplate()
  }

  render() {
    let { actionName } = this.props
    actionName = actionName || 'ログイン'
    return (
      <Card>
        <CardItem>
          <Body style={styles.stretch}>
            <TextInput
              label='Email'
              onChange={email => this.setState({email})}
              item={this.state.email}
              textContentType={'username'}
              keyboardType={'email-address'}
            />
            <TextInput
              label='パスワード'
              onChange={password => this.setState({password})}
              item={this.state.password}
              secureTextEntry={true}
              textContentType={'password'}
            />
          </Body>
        </CardItem>
        <CardItem>
          <Body style={styles.stretch}>
            <Button block disabled={this.state.inProgress} onPress={() => this.submit()} >
              <Text>{this.state.inProgress ? `${actionName}しています...` : actionName}</Text>
            </Button>
          </Body>
        </CardItem>
        {this.props.children}
      </Card>
    )
  }
}
