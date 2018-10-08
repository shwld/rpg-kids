import { Query as ApolloQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { Character } from '../types'
import { Query as StatusQuery } from './shared/CharacterStatus'
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
      sex
      acquirementsCount
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
  GetUser: StatusQuery.GetUser,
  GetCharacter: getCharacterQuery,
}

export const Component = {
  GetCharacter,
}

export const Graphql = {
  SelectCharacter,
  EditCharacter,
}
