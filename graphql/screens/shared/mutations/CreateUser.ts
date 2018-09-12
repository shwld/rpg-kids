import gql from 'graphql-tag'
import { graphql, ChildDataProps } from 'react-apollo'
import { UserState } from '../../../types'

const createUserMutation = gql`
  mutation SignUp {
    signUp {
      user {
        id
      }
    }
  }
`

export default <T>() => {
  return graphql<T, {user: UserState}, {}, ChildDataProps<{}, {user: UserState}, {}>>(createUserMutation, { name: 'createUser'})
}
