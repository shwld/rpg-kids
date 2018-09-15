import React from "react"
import styles from '../styles'
import {
  Card,
  CardItem,
  Body,
  Button,
  Text,
} from 'native-base'
import { TextInput, DateInput, InputString, InputDate } from '../components/Forms'
import toDate from '../lib/utils/toDate'

interface Props {
  defaultValues?: {
    name: string
    acquiredAt: string|Date
  }
  save(data: State): void
}

export interface State {
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

  save() {
    if (!this.valid()) { return }
    this.props.save(this.state)
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
