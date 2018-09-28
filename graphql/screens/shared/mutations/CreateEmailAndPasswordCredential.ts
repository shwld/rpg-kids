import { graphql, ChildDataProps } from 'react-apollo'
import gql from 'graphql-tag'
import { UserState } from '../../../types'

const createEmailAndPasswordCredentialMutation = gql`
  mutation CreateEmailAndPasswordCredential($email:String!, $password:String!) {
    createEmailAndPasswordCredential(email: $email, password: $password) @client
  }
`

export default <T>() => {
  return graphql<T, boolean, {}, ChildDataProps<{}, {user: UserState}, {}>>(createEmailAndPasswordCredentialMutation, { name: 'createEmailAndPasswordCredential'})
}
