import { graphql, Query as ApolloQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { RelayConnection, Acquirement } from '../types'
import { SetInProgress } from './shared/mutations'


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


const blockAcquirmentMutation = gql`
  mutation BlockAcquirement($acquirementId:ID!) {
    blockAcquirement(acquirementId: $acquirementId) {
      errors
    }
  }
`

class GetAcquirements extends ApolloQuery<GetAcquirementsResponse, GetAcquirementsVariables> {}

export const Query = {
  GetAcquirements: getAcquirementsQuery,
}

export const Mutation = {
  BlockAcquirement: blockAcquirmentMutation,
}

export const Component = {
  GetAcquirements,
}

export const Graphql = {
  BlockAcquirement<T>() {
    return graphql(Mutation.BlockAcquirement, { name: 'blockAcquirement'})
  },
  SetInProgress,
}
