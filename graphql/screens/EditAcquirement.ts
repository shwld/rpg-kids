import gql from 'graphql-tag'
import { Query as ApolloQuery } from 'react-apollo'
import { Character } from '../types'
import { Query as MyStatusQuery, Getter as MyStatusGetter } from './MyStatus'
import EditAcquirement, { mutateCallbacks as EditAcquirementMutateCallbacks } from './shared/mutations/EditAcquirement'


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

export const MutateCallbacks = {
  EditAcquirement: EditAcquirementMutateCallbacks,
}

export const Graphql = {
  EditAcquirement,
}
