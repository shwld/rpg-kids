import { Query as ApolloQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { State } from '../types'

type GetUserStateResponse = {
  state: State
}
type GetUserStateVariables = {
}
const GetUserStateQuery = gql`
  query getUserState {
    state @client {
      user {
        hasEmail
        email
      }
    }
  }
`

class GetUserState extends ApolloQuery<GetUserStateResponse, GetUserStateVariables> {}

export const Query = {
  GetUserState: GetUserStateQuery,
}

export const Component = {
  GetUserState,
}
