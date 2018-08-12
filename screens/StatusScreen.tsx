import React from "react";
import { AppLoading } from 'expo'
import { graphql } from 'react-apollo'
import { NavigationScreenProp } from 'react-navigation'
import gql from 'graphql-tag'
import {
  View,
} from "native-base"
import Status from '../components/Status'
import Acquirements from '../components/Acquirements'

interface Props {
  navigation: NavigationScreenProp<any, any>
  data: {
    loading: boolean
    character: {
      id: string
      name: string
      birthday: Date
      description: string
      acquirements: {
        edges: {
          node: {
            name: string
            acquiredAt: Date
          }
        }[]
      }
    }
  }
}

const GET_CHARACTER = gql`
query GetCharacter($id:ID = "") {
  character(id: $id) {
    id
    name
    birthday
    description
    acquirements(last: 5) {
      edges {
        node {
          id
          name
          acquiredAt
        }
      }
    }
  }
}
`;

class StatusScreen extends React.Component<Props> {

  componentWillReceiveProps(newProps: Props) {
    const { data } = newProps
    console.log(data)
    if (data.loading) { return }
  }

  render () {
    const { navigation, data } = this.props
    if (data.loading || !data.character) {
      return <AppLoading />
    }
    const { character } = data
    const acquirements: any[] = character.acquirements.edges.map(it => it.node)
    return (
      <View>
        <Status character={character} />
        <Acquirements
          title="最近できるようになったこと"
          birthday={character.birthday}
          acquirements={acquirements}
          goLogs={() => navigation.navigate('Log', { characterId: character.id })}
          goSkill={() => {}}
        />
      </View>
    )
  }
}

export default graphql(GET_CHARACTER, {
  name: 'data',
  props: (props: any) => {
    props.data.variables.id = props.ownProps.navigation.getParam('characterId', '')
    return props
  }
})(StatusScreen)

