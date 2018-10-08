import { Query as ApolloQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { RelayConnection, Character } from '../types'


interface GetCharactersResponse {
  acquirementRankingsOfCharacter: RelayConnection<Character>
}
interface GetCharactersVariables {
  cursor: string|null
}
const getCharactersQuery = gql`
  query AcquirementRankingsOfCharacter($cursor: String) {
    acquirementRankingsOfCharacter(first: 30, after: $cursor) {
      edges {
        node {
          id
          name
          birthday
          description
          imageUrl
          sex
          acquirementsCount
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

class GetCharacters extends ApolloQuery<GetCharactersResponse, GetCharactersVariables> {}

export const Query = {
  GetCharacters: getCharactersQuery,
}

export const Component = {
  GetCharacters,
}

export const Graphql = {
}
