import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Query as StatusQuery } from '../../shared/CharacterStatus'
import { Query as FlowQuery } from '../../Flow'


const removeCharacterMutation = gql`
  mutation RemoveCharacter($id:ID!) {
    removeCharacter(id: $id) {
      user {
        id
        createdAt
        characters {
          edges {
            node {
              id
              name
              birthday
              description
              imageUrl
              acquirements(first: 5) {
                edges {
                  node {
                    id
                    name
                    acquiredAt
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const mutateCallbacks = () => ({
  refetchQueries: [{
    query: FlowQuery.GetAcquirements,
  }],
  update: (store, result) => {
    const data = store.readQuery({ query: StatusQuery.GetUser })
    data.user = result.data.removeCharacter.user
    store.writeQuery({ query: StatusQuery.GetUser, data })
  },
})

export default <T>() => {
  return graphql<T>(removeCharacterMutation, { name: 'removeCharacter' })
}
