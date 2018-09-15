import { graphql, ChildDataProps } from 'react-apollo'
import gql from 'graphql-tag'
import { UserState } from '../../../types'

const signInAnonymouslyMutation = gql`
  mutation SignInAnonymously {
    signInAnonymously @client
  }
`

export default <T>() => {
  return graphql<T, boolean, {}, ChildDataProps<{}, {user: UserState}, {}>>(signInAnonymouslyMutation, { name: 'signInAnonymously'})
}
