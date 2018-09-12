import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const editAcquirementMutation = gql`
  mutation EditAcquirement($id:ID!, $characterId: ID!, $name:String!, $acquiredAt:DateTime!) {
    editAcquirement(id: $id, characterId: $characterId, name: $name, acquiredAt: $acquiredAt) {
      acquirement {
        id
        name
        acquiredAt
        skillId
      }
      errors
    }
  }
`

export default <T>() => {
  return graphql<T>(editAcquirementMutation, { name: 'editAcquirement' })
}
