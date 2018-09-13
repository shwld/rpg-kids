import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const acceptInviteMutation = gql`
  mutation AcceptInvitation($id:ID!) {
    acceptInvitation(id: $id) {
      errors
    }
}
`

export default <T>() => {
  return graphql<T>(acceptInviteMutation, { name: 'acceptInvititation' })
}
