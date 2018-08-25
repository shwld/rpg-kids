import { Query as ApolloQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { Character } from '../types'

interface GetCharacterResponse {
  character: Character
}
interface GetCharacterVariables {
  id: string
  cursor: string|null
}
const getCharacterQuery = gql`
  query Character($id:ID = "", $cursor: String) {
    character(id: $id) {
      id
      name
      birthday
      imageUrl
      acquirements(first: 30, after: $cursor) {
        edges {
          node {
            id
            skillId
            name
            acquiredAt
          }
        }
        pageInfo {
          hasNextPage
          endCursor
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
