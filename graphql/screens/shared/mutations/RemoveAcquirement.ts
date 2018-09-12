import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const removeAcquirementMutation = gql`
  mutation RemoveAcquirement($id:ID!, $characterId:ID!) {
    removeAcquirement(characterId: $characterId, id: $id) {
      character {
        id
      }
      errors
    }
  }
`

export default <T>() => {
  return graphql<T>(removeAcquirementMutation, { name: 'removeAcquirement' })
}

