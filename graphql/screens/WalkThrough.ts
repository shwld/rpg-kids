import gql from 'graphql-tag'
import { graphql, ChildDataProps } from 'react-apollo'
import { UserState } from '../types'

const SignInMutation = gql`
  mutation SignIn {
    signIn @client
  }
`

const SignUpMutation = gql`
  mutation SignUp {
    signUp {
      user {
        id
      }
    }
  }
`

export interface SignInResult {
  data: {
    signIn: boolean
  }
}

export interface SignUpResult {
  data: {
    signUp: {
      user: UserState
    }
  }
}

export interface Response {
  signIn(): Promise<SignInResult>
  signUp(): Promise<SignUpResult>
}

export const Graphql = {
  SignIn<T>(){
    return graphql<T, boolean, {}, ChildDataProps<{}, {user: UserState}, {}>>(SignInMutation, { name: 'signIn'})
  },
  SignUp<T>(){
    return graphql<T, {user: UserState}, {}, ChildDataProps<{}, {user: UserState}, {}>>(SignUpMutation, { name: 'signUp'})
  },
}
