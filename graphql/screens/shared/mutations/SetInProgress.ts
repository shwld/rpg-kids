import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const setInProgressMutation = gql`
  mutation SetInProgress($inProgress:Boolean = true) {
    setInProgress(inProgress: $inProgress) @client
  }
`

export default <T>() => {
  return graphql<T>(setInProgressMutation, { name: 'setInProgress' })
}
