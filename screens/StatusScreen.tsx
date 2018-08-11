import React from "react";
import { AppLoading } from 'expo'
import { graphql, compose } from 'react-apollo'
import { NavigationScreenProp } from 'react-navigation'
import gql from 'graphql-tag'
import {
  View,
} from "native-base"
import Status from '../components/Status'
import Skills from '../components/Skills'

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
    const character = characters[0]
    return (
      <View>
        <Status
          character={character}
          selectableCharacters={characters}
          goGetSkill={() => navigation.navigate('AcquireSkillScreen', {characterId: character.id})}
          onChangeCharacter={v => console.log(v)}
        ></Status>
        <Skills
          title="最近できるようになったこと"
          skills={[]}
          goLogs={() => navigation.navigate('Log')}
          goSkill={() => navigation.navigate('Skill')}
        ></Skills>
        <Skills
          title="もうすぐできるかも"
          skills={[]}
          goLogs={() => navigation.navigate('Log')}
          goSkill={() => navigation.navigate('Skill')}
        ></Skills>
      </View>
    )
  }
}

export default compose(
  graphql(GET_USER, { name: 'data'}),
)(StatusScreen)

