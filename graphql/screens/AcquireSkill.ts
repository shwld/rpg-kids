import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { SetInProgress } from './shared/mutations'

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

export const Graphql = {
  AcquireSkill<T>() {
    return graphql<T>(acquireSkillMutation, { name: 'acquireSkill' })
  },
  SetInProgress,
}
