import gql from 'graphql-tag'
import { graphql, ChildDataProps } from 'react-apollo'
import { UserState } from '../types'
import { SetInProgress } from './shared/mutations'

const SignInMutation = gql`
  mutation SignIn {
    signInAnonymously @client
  }
`

const CreateUserMutation = gql`
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
    signInAnonymously: boolean
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
  signInAnonymously(): Promise<SignInResult>
  signUp(): Promise<SignUpResult>
}

export const Graphql = {
  SignInAnonymously<T>(){
    return graphql<T, boolean, {}, ChildDataProps<{}, {user: UserState}, {}>>(SignInMutation, { name: 'signInAnonymously'})
  },
  CreateUser<T>(){
    return graphql<T, {user: UserState}, {}, ChildDataProps<{}, {user: UserState}, {}>>(CreateUserMutation, { name: 'createUser'})
  },
  SetInProgress,
}
