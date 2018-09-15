import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const authenticateMutation = gql`
  mutation {
    authenticate @client
  }
`

export default <T>() => {
  return graphql<T>(authenticateMutation, { name: 'authenticate' })
}
