import gql from 'graphql-tag'
import firebase, { authenticate } from '../lib/firebase'
import { AsyncStorage } from 'react-native'

const signInQuery = (isSignedIn: boolean) => {
  const query = gql`
    query getState @client {
      state {
        user {
          isSignedIn
        }
      }
    }
  `
  const data = {
    state: {
      __typename: 'State',
      user: {
        __typename: 'User',
        isSignedIn,
      }
    }
  }
  return { query, data }
}

export default {
  signInAnonymously: async (_obj, _args, { cache }: { cache }) => {
    await firebase.auth().signInAnonymously()
    cache.writeQuery(signInQuery(true))
    return true
  },
  authenticate: async (_obj, _args, { cache }: { cache }) => {
    const isSignedIn: boolean = await authenticate()
    cache.writeQuery(signInQuery(isSignedIn))
    return isSignedIn
  },
  selectCharacter: async (_obj, {characterId}: {characterId: string}, { cache }: { cache }) => {
    const query = gql`
      query getState @client {
        state {
          selectedCharacterId
        }
      }
    `
    const data = {
      state: {
        __typename: 'State',
        selectedCharacterId: characterId,
      }
    }
    cache.writeQuery({ query, data })
    try {
      await AsyncStorage.setItem('rpg:selectedCharacterId', characterId)
    } catch (e) {
      console.error(e)
    }
    return characterId
  },
}
