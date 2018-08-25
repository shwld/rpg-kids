import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { SetInProgress, SelectCharacter } from './shared/mutations'
import { Query as MyStatusQuery } from './MyStatus'

const addCharacterMutation = gql`
  mutation addCharacter($name:String = "", $birthday:DateTime = "2000/1/1", $description:String = "") {
    addCharacter(name: $name, birthday: $birthday, description: $description) {
      character {
        id
        name
        birthday
        description
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

const updateImageUrlMutation = gql`
  mutation editCharacter($id:ID!, $imageUrl:String = null) {
    editCharacter(id: $id, imageUrl: $imageUrl) {
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

export const Query = {
  GetUser: MyStatusQuery.GetUser,
}

export const Mutation = {
  AddCharacter: addCharacterMutation,
  UpdateImageUrl: updateImageUrlMutation,
}

export const Graphql = {
  AddCharacter<T>() {
    return graphql<T>(Mutation.AddCharacter, { name: 'addCharacter'})
  },
  UpdateImageUrl<T>() {
    return graphql<T>(Mutation.UpdateImageUrl, { name: 'updateImageUrl'})
  },
  SetInProgress,
  SelectCharacter,
}
