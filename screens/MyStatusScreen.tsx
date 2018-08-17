import React from "react"
import { AppLoading } from 'expo'
import { Query, graphql } from 'react-apollo'
import { NavigationScreenProp } from 'react-navigation'
import gql from 'graphql-tag'
import {
  View,
} from "native-base"
import Status, { NEW_CHARACTER_ID } from '../components/Status'
import Acquirements from '../components/Acquirements'
import isEmpty from '../lib/utils/isEmpty'
import { SELECT_CHARACTER } from '../graphql/mutations'

interface Props {
  navigation: NavigationScreenProp<any, any>
  selectCharacter(payload: { variables: {characterId: string}})
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
  state @client {
    selectedCharacterId
  }
}
`

const getCharacter = (characters, id) => {
  let character = null
  if (id) {
    character = characters.find(it => it.id === id)
  }
  return character || characters[0]
}

const Screen = (props: Props) => (
  <Query query={GET_USER} fetchPolicy="cache-and-network">
    {({data}) => {
      if (isEmpty(data) || data.loading) {
        return <AppLoading />
      }

      const characters = data.user.characters.edges.map(it => it.node)

      if (data.user.characters.edges.length === 0) {
        props.navigation.replace('AddCharacter')
        return
      }

      const character = getCharacter(characters, data.state.selectedCharacterId)
      const acquirements: any[] = character.acquirements.edges.map(it => it.node)

      return (
        <View>
          <Status
            character={character}
            selectableCharacters={characters}
            goGetSkill={() => props.navigation.navigate('AcquireSkillScreen', {characterId: character.id})}
            onChangeCharacter={async characterId => {
              if (characterId === NEW_CHARACTER_ID) {
                props.navigation.navigate('AddCharacter')
                return
              }
              await props.selectCharacter({variables: {characterId}})
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

export default graphql<Props>(SELECT_CHARACTER, { name: 'selectCharacter'})(Screen)

