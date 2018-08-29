import { Query as ApolloQuery, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Character } from '../types'
import { SetInProgress, SelectCharacter } from './shared/mutations'
import { Query as MyStatusQuery } from './MyStatus'

const editCharacterMutation = gql`
  mutation EditCharacter($id:ID!, $name:String = null, $birthday:DateTime = null, $description:String = null, $imageUrl:String = null) {
    editCharacter(id: $id, name: $name, birthday: $birthday, description: $description, imageUrl: $imageUrl) {
      character {
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
      errors
    }
  }
`

const removeCharacterMutation = gql`
  mutation RemoveCharacter($id:ID!) {
    removeCharacter(id: $id) {
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
    }
  }
`

const getCharacterQuery = gql`
  query GetCharacter($id:ID = "") {
    character(id: $id) {
      id
      name
      birthday
      description
      imageUrl
    }
  }
`

interface GetCharacterResponse {
  character: Character
}
interface GetCharacterVariables {
  id: string
}

class GetCharacter extends ApolloQuery<GetCharacterResponse, GetCharacterVariables> {}

export const Query = {
  GetUser: MyStatusQuery.GetUser,
  GetCharacter: getCharacterQuery,
}

export const Mutation = {
  EditCharacter: editCharacterMutation,
  RemoveCharacter: removeCharacterMutation,
}

export const Component = {
  GetCharacter,
}

export const Graphql = {
  EditCharacter<T>() {
    return graphql(Mutation.EditCharacter, { name: 'editCharacter'})
  },
  RemoveCharacter<T>() {
    return graphql(Mutation.RemoveCharacter, { name: 'removeCharacter'})
  },
  SetInProgress,
  SelectCharacter,
}

export const Getter = {
}
