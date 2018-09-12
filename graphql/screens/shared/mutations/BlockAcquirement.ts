
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const blockAcquirmentMutation = gql`
  mutation BlockAcquirement($acquirementId:ID!) {
    blockAcquirement(acquirementId: $acquirementId) {
      errors
    }
  }
`

export default <T>() => {
  return graphql(blockAcquirmentMutation, { name: 'blockAcquirement'})
}
