import { UserState } from '../types'
import SetInProgress from './shared/mutations/SetInProgress'
import SignInAnonymously from './shared/mutations/SignInAnonymously'
import CreateUser from './shared/mutations/CreateUser'


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
  SignInAnonymously,
  CreateUser,
  SetInProgress,
}
