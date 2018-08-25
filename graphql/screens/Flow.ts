import { Query as ApolloQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { RelayConnection, Acquirement } from '../types'


interface GetAcquirementsResponse {
  acquirements: RelayConnection<Acquirement>
}
interface GetAcquirementsVariables {
  cursor: string|null
}
const getAcquirementsQuery = gql`
  query Acquirements($cursor: String) {
    acquirements(first: 30, after: $cursor) {
      edges {
        node {
          id
          name
          acquiredAt
          character {
            id
            name
            birthday
            imageUrl
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

class GetAcquirements extends ApolloQuery<GetAcquirementsResponse, GetAcquirementsVariables> {}

export const Query = {
  GetAcquirements: getAcquirementsQuery,
}

export const Component = {
  GetAcquirements,
}
