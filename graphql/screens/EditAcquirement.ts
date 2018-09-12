import gql from 'graphql-tag'
import { Query as ApolloQuery } from 'react-apollo'
import { Character } from '../types'
import { Query as MyStatusQuery, Getter as MyStatusGetter } from './MyStatus'
import SetInProgress from './shared/mutations/SetInProgress'
import EditAcquirement from './shared/mutations/EditAcquirement'
import RemoveAcquirement from './shared/mutations/RemoveAcquirement'


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
  EditAcquirement,
  RemoveAcquirement,
  SetInProgress,
}
