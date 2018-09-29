import gql from 'graphql-tag'
import firebase, { authenticate } from '../lib/firebase'
import { AsyncStorage } from 'react-native'

const signInQuery = (cache, {isSignedIn, hasEmail = false, email}: {isSignedIn: boolean, hasEmail?: boolean, email: string|null}) => {
  const query = gql`
    query getState @client {
      state {
        user {
          isSignedIn
          hasEmail
          email
        }
      }
    }
  `
  let data = cache.readQuery({query})
  data.state.user.isSignedIn = isSignedIn
  data.state.user.hasEmail = hasEmail
  if (email) { data.state.user.email = email }
  return { query, data }
}

export default {
  signInAnonymously: async (_obj, _args, { cache }: { cache }) => {
    await firebase.auth().signInAnonymously()
    cache.writeQuery(signInQuery(cache, {isSignedIn: true}))
    return true
  },
  signInWithEmailAndPassword: async (_obj, {email, password}: {email: string, password: string}, { cache }: { cache }) => {
    const credential = await firebase.auth().signInWithEmailAndPassword(email, password)
    const isSignedIn = credential ? true : false
    cache.writeQuery(signInQuery(cache, {isSignedIn, hasEmail: true, email}))
    return true
  },
  createEmailAndPasswordCredential: async (_obj, {email, password}: {email: string, password: string}, { cache }: { cache }) => {
    try {
      const currentUser = firebase.auth().currentUser
      if (!currentUser) { return false }
      const credential = await firebase.auth.EmailAuthProvider.credential(email, password)
      await currentUser.linkAndRetrieveDataWithCredential(credential)
    } catch (e) {
      console.warn(e)
      return false
    }
    cache.writeQuery(signInQuery(cache, {isSignedIn: true, hasEmail: true, email}))
    return true
  },
  authenticate: async (_obj, _args, { cache }: { cache }) => {
    const user = await authenticate()
    const isSignedIn = user ? true : false
    const email = user ? user.email : null
    const hasEmail = email ? true : false
    cache.writeQuery(signInQuery(cache, {isSignedIn, hasEmail, email}))
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
