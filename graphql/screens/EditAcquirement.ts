import gql from 'graphql-tag'
import { Query as ApolloQuery, graphql } from 'react-apollo'
import { Character } from '../types'
import { Query as MyStatusQuery, Getter as MyStatusGetter } from './MyStatus'
import { SetInProgress } from './shared/mutations'

const editAcquirementMutation = gql`
  mutation EditAcquirement($id:ID!, $characterId: ID!, $name:String!, $acquiredAt:DateTime!) {
    editAcquirement(id: $id, characterId: $characterId, name: $name, acquiredAt: $acquiredAt) {
      acquirement {
        id
        name
        acquiredAt
        skillId
      }
      errors
    }
  }
`

const removeAcquirementMutation = gql`
  mutation RemoveAcquirement($id:ID!, $characterId:ID!) {
    removeAcquirement(characterId: $characterId, id: $id) {
      character {
        id
      }
      errors
    }
  }
`

interface GetAcquirementResponse {
  character: Character
}
interface GetAcquirementVariables {
  id: string
  characterId: string
}
const getAcquirementQuery = gql`
  query GetAcquirement($id:ID!, $characterId:ID!) {
    character(id: $characterId) {
      id
      name
      birthday
      description
      acquirement(id: $id) {
        id
        name
        acquiredAt
      }
    }
  }
`

class GetAcquirement extends ApolloQuery<GetAcquirementResponse, GetAcquirementVariables> {}

export const Query = {
  GetUser: MyStatusQuery.GetUser,
  GetAcquirement: getAcquirementQuery,
}

export const Getter = {
  GetCharacter: MyStatusGetter.getCharacter,
}

export const Component = {
  GetAcquirement,
}

export const Graphql = {
  EditAcquirement<T>() {
    return graphql<T>(editAcquirementMutation, { name: 'editAcquirement' })
  },
  RemoveAcquirement<T>() {
    return graphql<T>(removeAcquirementMutation, { name: 'removeAcquirement' })
  },
  SetInProgress,
}
