import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Query as StatusQuery } from '../../shared/CharacterStatus'
import { Query as FlowQuery } from '../../Flow'

const acquireSkillMutation = gql`
  mutation AcquireSkill($characterId: ID!, $name:String!, $acquiredAt:DateTime!) {
    acquireSkill(characterId: $characterId, name: $name, acquiredAt: $acquiredAt) {
      acquirement {
        id
        name
        acquiredAt
      }
      errors
    }
  }
`

export const mutateCallbacks = (characterId: string) => ({
  refetchQueries: [{
    query: FlowQuery.GetAcquirements,
  }],
  update: (store, result) => {
    const data = store.readQuery({ query: StatusQuery.GetUser })
    const character = data.user.characters.edges.map(it => it.node).find(it => it.id === characterId)
    if (!character) { return }
    character.acquirements.edges = [
      { node: result.data.acquireSkill.acquirement, __typename: 'AcquirementEdge' },
      ...character.acquirements.edges
    ]
    store.writeQuery({ query: StatusQuery.GetUser, data })
  },
})

export default <T>() => {
  return graphql<T>(acquireSkillMutation, { name: 'acquireSkill' })
}
