import { Query as ApolloQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { User, State, Character } from '../../types'
import SelectCharacter from './mutations/SelectCharacter'
import RemoveCharacter, { mutateCallbacks } from './mutations/RemoveCharacter'

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

type GetUserResponse = {
  user: User
  state: State
}

type GetUserVariables = {
  first: number
}

class GetUser extends ApolloQuery<GetUserResponse, GetUserVariables> {}

export const Query = {
  GetUser: getUserQuery,
}

export const Component = {
  GetUser,
}

export const Getter = {
  getCurrentCharacter(result: GetUserResponse) {
    const id = result.state.selectedCharacterId
    return this.getCharacter(result, id)
  },
  getCharacter(result: GetUserResponse, id: string) {
    const characters = result.user.characters.edges.map(it => it.node)
    if (characters.length === 0) { return null }
    let character: Character|undefined
    if (id) {
      character = characters.find(it => it.id === id)
    }
    return character || characters[0]
  }
}

export const MutateCallbacks = {
  RemoveCharacter: mutateCallbacks,
}

export const Graphql = {
  SelectCharacter,
  RemoveCharacter,
}
