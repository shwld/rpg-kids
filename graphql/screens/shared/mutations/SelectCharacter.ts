
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const selectCharacterMutation = gql`
mutation SelectCharacter($characterId:ID!) {
  selectCharacter(characterId: $characterId) @client
}
`

export default <T>() => {
  return graphql<T>(selectCharacterMutation, { name: 'selectCharacter' })
}

