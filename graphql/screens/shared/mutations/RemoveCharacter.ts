import gql from 'graphql-tag'
import { graphql } from 'react-apollo'


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


export const RemoveCharacter = <T>() => {
  return graphql<T>(removeCharacterMutation, { name: 'removeCharacter' })
}
