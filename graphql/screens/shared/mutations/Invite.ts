import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const inviteMutation = gql`
  mutation Invite($characterId:ID!) {
    invite(characterId: $characterId) {
      invitation {
        id
        state
        expiredAt
      }
      errors
    }
}
`

export default <T>() => {
  return graphql<T>(inviteMutation, { name: 'invite' })
}
