import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import styles from '../styles'
import {
  Content,
  Card,
  CardItem,
  Body,
  Button,
  Text,
} from "native-base"
import { TextInput, DateInput, InputString, InputDate } from '../components/Forms'
import { compose, graphql } from 'react-apollo'
import { SET_IN_PROGRESS } from '../graphql/mutations'
import gql from 'graphql-tag'
import { GET_USER } from './MyStatusScreen'
import getParam from '../lib/utils/getParam'


interface Props {
  characterId: string
  navigation: NavigationScreenProp<any, any>
  acquireSkill(payload: { variables: {characterId: string, name: string, acquiredAt: Date}, update: any })
  setInProgress(payload: { variables: {inProgress: boolean}})
}

interface State {
  name: InputString
  acquiredAt: InputDate
}

const ACQUIRE_SKILL = gql`
mutation AcquireSkill($characterId: String!, $name:String!, $acquiredAt:DateTime!) {
  acquireSkill(characterId: $characterId, name: $name, acquiredAt: $acquiredAt) {
    acquirement {
      id
      name
      acquiredAt
    }
    errors
  }
}
`

class Screen extends React.Component<Props, State> {
  state: State = {
    name: {
      value: '',
      validate: value => (value.trim() !== ''),
    },
    acquiredAt: {
      value: new Date(),
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
    const { navigation, acquireSkill, setInProgress } = this.props
    const characterId = getParam({navigation}, 'characterId')
    setInProgress({variables: { inProgress: true }})
    try {
      if (!this.valid()) { return }
      const { name, acquiredAt } = this.state
      await acquireSkill({
        variables: {
          characterId,
          name: name.value,
          acquiredAt: acquiredAt.value,
        },
        update: (store, result) => {
          const data = store.readQuery({ query: GET_USER })
          const character = data.user.characters.edges.map(it => it.node).find(it => it.id === characterId)
          if (!character) { return }
          character.acquirements.edges = [
            { node: result.data.acquireSkill.acquirement, __typename: 'AcquirementEdge' },
            ...character.acquirements.edges
          ]
          store.writeQuery({ query: GET_USER, data })
        },
      })
      navigation.pop()
    } catch (e) {
      throw e
    } finally {
      setInProgress({variables: { inProgress: false }})
    }
  }

  render() {
    return (
      <Content contentContainerStyle={styles.stretch}>
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
  graphql(ACQUIRE_SKILL, { name: 'acquireSkill' }),
  graphql(SET_IN_PROGRESS, { name: 'setInProgress' }),
)(Screen)
