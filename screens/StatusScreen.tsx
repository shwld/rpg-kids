import React from "react";
import { AppLoading } from 'expo'
import { graphql, compose } from 'react-apollo'
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
    user: {
      id: string,
      characters: {
        edges: {
          node: {
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
        }[]
      }
    }
  }
}

const GET_USER = gql`
query {
  user {
    id
    createdAt
    characters {
      edges {
        node {
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
    }
  }
}
`;

class StatusScreen extends React.Component<Props> {
  _deckSwiper

  componentWillReceiveProps(newProps: Props) {
    const { navigation, data } = newProps
    if (data.loading) {
      return
    }
    if (data.user.characters.edges.length === 0) {
      navigation.replace('AddCharacter')
    }
  }

  render () {
    const { navigation, data } = this.props
    if (data.loading || data.user.characters.edges.length === 0) {
      return <AppLoading />
    }
    const characters = data.user.characters.edges.map(it => it.node)
    // TODO: Change character
    const character = characters[0]
    const acquirements: any[] = character.acquirements.edges.map(it => it.node)
    console.log(acquirements)
    return (
      <View>
        <Status
          character={character}
          selectableCharacters={characters}
          goGetSkill={() => navigation.navigate('AcquireSkillScreen', {characterId: character.id})}
          onChangeCharacter={v => console.log(v)}
        ></Status>
        <Acquirements
          title="最近できるようになったこと"
          acquirements={acquirements}
          goLogs={() => navigation.navigate('Log')}
          goSkill={() => navigation.navigate('Skill')}
        ></Acquirements>
      </View>
    )
  }
}

export default compose(
  graphql(GET_USER, { name: 'data'}),
)(StatusScreen)

