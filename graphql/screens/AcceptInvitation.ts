import { Query as ApolloQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { State } from '../types'
import SignInAnonymously from './shared/mutations/SignInAnonymously'
import SelectCharacter from './shared/mutations/SelectCharacter'
import CreateUser from './shared/mutations/CreateUser'
import AcceptInvititation from './shared/mutations/AcceptInvititation'


interface GetSignInStateResponse {
  state: State,
}
interface SignInStateVariables {
}
const getSignInState = gql`
  query getState @client {
    state {
      user {
        isSignedIn
      }
    }
  }
`

class GetSignInState extends ApolloQuery<GetSignInStateResponse, SignInStateVariables> {}

export const Query = {
  GetSignInState: getSignInState,
}

export const Component = {
  GetSignInState,
}

export const Graphql = {
  SignInAnonymously,
  CreateUser,
  AcceptInvititation,
  SelectCharacter,
}
