import React from "react";
import { AppLoading } from 'expo'
import { Query } from 'react-apollo'
import { NavigationScreenProp } from 'react-navigation'
import gql from 'graphql-tag'
import {
  View,
} from "native-base"
import Status, { NEW_CHARACTER_ID } from '../components/Status'
import Acquirements from '../components/Acquirements'
import isEmpty from '../lib/utils/isEmpty'

interface Props {
  navigation: NavigationScreenProp<any, any>
}

export const GET_USER = gql`
query GetUser {
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
          acquirements(first: 5) {
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

export default (props: Props) => (
  <Query query={GET_USER} fetchPolicy="cache-and-network">
    {(res) => {
      const {data} = res
      console.log(res)
      if (isEmpty(data) || data.loading) {
        return <AppLoading />
      }

      const characters = data.user.characters.edges.map(it => it.node)

      if (data.user.characters.edges.length === 0) {
        props.navigation.replace('AddCharacter')
        return
      }

      // TODO: Change character
      const character = characters[0]
      const acquirements: any[] = character.acquirements.edges.map(it => it.node)

      return (
        <View>
          <Status
            character={character}
            selectableCharacters={characters}
            goGetSkill={() => props.navigation.navigate('AcquireSkillScreen', {characterId: character.id})}
            onChangeCharacter={id => {
              if (id === NEW_CHARACTER_ID) {
                props.navigation.navigate('AddCharacter')
                return
              }
              // TODO: Change character
            }}
          ></Status>
          <Acquirements
            title="最近できるようになったこと"
            birthday={character.birthday}
            acquirements={acquirements}
            goLogs={() => props.navigation.navigate('Log', { characterId: character.id })}
            goSkill={() => {}}
          ></Acquirements>
        </View>
      )
    }}
  </Query>
)
