import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Query as FlowQuery } from '../../Flow'
import { Query as EditAcquirementQuery, Getter as EditAcquirementGetter } from '../../EditAcquirement'

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

export const mutateCallbacks = (characterId: string, acquirementId: string) => ({
  refetchQueries: [{
  query: FlowQuery.GetAcquirements,
  variables: { repoName: 'apollographql/apollo-client' },
  }],
  update: (store) => {
    let data = store.readQuery({ query: EditAcquirementQuery.GetUser })
    const character = EditAcquirementGetter.GetCharacter(data, characterId)
    if (character) {
      let acquirementsEdges = character.acquirements.edges.filter(it => it.node.id !== acquirementId)
      character.acquirements.edges = acquirementsEdges
      store.writeQuery({ query: EditAcquirementQuery.GetUser, data })
    }
  },
})

export default <T>() => {
  return graphql<T>(removeAcquirementMutation, { name: 'removeAcquirement' })
}

