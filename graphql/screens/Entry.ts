import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const authenticateMutation = gql`
  mutation {
    authenticate @client
  }
`

export const Graphql = {
  Authenticate<T>() {
    return graphql<T>(authenticateMutation, { name: 'authenticate' })
  },
}
