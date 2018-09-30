import { Query as ApolloQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { Character } from '../types'

type GetCharacterResponse = {
  character: Character
}
type GetCharacterVariables = {
  id: string
}
const getCharacterQuery = gql`
  query GetCharacter($id:ID = "") {
    character(id: $id) {
      id
      name
      birthday
      description
      imageUrl
      acquirementsCount
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
`

class GetCharacter extends ApolloQuery<GetCharacterResponse, GetCharacterVariables> {}

export const Query = {
  GetCharacter: getCharacterQuery,
}

export const Component = {
  GetCharacter,
}
