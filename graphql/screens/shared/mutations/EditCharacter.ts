import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const editCharacterMutation = gql`
  mutation EditCharacter($id:ID!, $name:String = null, $birthday:DateTime = null, $description:String = null, $imageUrl:String = null, $sex:String = null) {
    editCharacter(id: $id, name: $name, birthday: $birthday, description: $description, imageUrl: $imageUrl, sex: $sex) {
      character {
        id
        name
        birthday
        description
        imageUrl
        sex
        acquirementsCount
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
  return graphql<T>(editCharacterMutation, { name: 'editCharacter' })
}
