import { Query as ApolloQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { Character } from '../types'
import { Query as MyStatusQuery } from './MyStatus'
import SetInProgress from './shared/mutations/SetInProgress'
import SelectCharacter from './shared/mutations/SelectCharacter'
import EditCharacter from './shared/mutations/EditCharacter'


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

export const Component = {
  GetCharacter,
}

export const Graphql = {
  SetInProgress,
  SelectCharacter,
  EditCharacter,
}
