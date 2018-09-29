import { graphql, ChildDataProps } from 'react-apollo'
import gql from 'graphql-tag'
import { UserState } from '../../../types'

const signInWithEmailAndPasswordMutation = gql`
  mutation SignInWithEmailAndPassword($email:String!, $password:String!) {
    signInWithEmailAndPassword(email: $email, password: $password) @client
  }
`

export default <T>() => {
  return graphql<T, boolean, {}, ChildDataProps<{}, {user: UserState}, {}>>(signInWithEmailAndPasswordMutation, { name: 'signInWithEmailAndPassword'})
}
