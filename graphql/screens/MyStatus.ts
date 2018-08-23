import { Query as ApolloQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { Data, User, State, Character } from '../types'

const getUserQuery = gql`
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
            imageUrl
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

export interface GetUserResult extends Data {
  user: User
  state: State
}

export interface GetUserVariables {
  first: number
}

class GetUser extends ApolloQuery<GetUserResult, GetUserVariables> {}

export const Query = {
  GetUser: getUserQuery,
}

export const Component = {
  GetUser,
}

export const Getter = {
  getCurrentCharacter(result: GetUserResult) {
    const id = result.state.selectedCharacterId
    return this.getCharacter(result, id)
  },
  getCharacter(result: GetUserResult, id: string) {
    const characters = result.user.characters.edges.map(it => it.node)
    if (characters.length === 0) { return null }
    let character: Character|undefined
    if (id) {
      character = characters.find(it => it.id === id)
    }
    return character || characters[0]
  }
}
