import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const setInProgressMutation = gql`
  mutation SetInProgress($inProgress:Boolean = true) {
    setInProgress(inProgress: $inProgress) @client
  }
`

const selectCharacterMutation = gql`
  mutation SelectCharacter($characterId:ID!) {
    selectCharacter(characterId: $characterId) @client
  }
`

export const SetInProgress = <T>() => {
  return graphql<T>(setInProgressMutation, { name: 'setInProgress' })
}

export const SelectCharacter = <T>() => {
  return graphql<T>(selectCharacterMutation, { name: 'selectCharacter' })
}
