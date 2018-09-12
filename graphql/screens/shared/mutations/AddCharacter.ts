import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const addCharacterMutation = gql`
  mutation addCharacter($name:String = "", $birthday:DateTime = "2000/1/1", $description:String = "") {
    addCharacter(name: $name, birthday: $birthday, description: $description) {
      character {
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
      errors
    }
  }
`

export default <T>() => {
  return graphql<T>(addCharacterMutation, { name: 'addCharacter'})
}
