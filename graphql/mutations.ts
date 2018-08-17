import gql from 'graphql-tag';
import firebase, { authenticate } from '../lib/firebase'

export default {
  signIn: async (_obj, _args, { cache }: { cache }) => {
    const query = gql`
      query getState @client {
        state {
          user {
            isSignedIn
          }
        }
      }
    `;
    const data = {
      state: {
        __typename: 'State',
        user: {
          __typename: 'User',
          isSignedIn: true,
        }
      }
    }
    await firebase.auth().signInAnonymously()
    cache.writeQuery({ query, data })
    return true;
  },
  authenticate: async (_obj, _args, { cache }: { cache }) => {
    const isSignedIn: boolean = await authenticate()
    if (!isSignedIn) { return false }

    const query = gql`
      query getState @client {
        state {
          user {
            isSignedIn
          }
        }
      }
    `;
    const data = {
      state: {
        __typename: 'State',
        user: {
          __typename: 'User',
          isSignedIn,
        }
      }
    }
    cache.writeQuery({ query, data });
    return true;
  },
  setInProgress: async (_obj, {inProgress}: {inProgress: boolean}, { cache }: { cache }) => {
    const query = gql`
      query getState @client {
        state {
          inProgress
        }
      }
    `;
    const data = {
      state: {
        __typename: 'State',
        inProgress,
      }
    }
    cache.writeQuery({ query, data });
    return true;
  },
  selectCharacter: (_obj, {characterId}: {characterId: string}, { cache }: { cache }) => {
    const query = gql`
      query getState @client {
        state {
          selectedCharacterId
        }
      }
    `;
    const data = {
      state: {
        __typename: 'State',
        selectedCharacterId: characterId,
      }
    }
    cache.writeQuery({ query, data });
    return characterId;
  }
}

export const SET_IN_PROGRESS = gql`
  mutation SetInProgress($inProgress:Boolean = true) {
    setInProgress(inProgress: $inProgress) @client
  }
`

export const SELECT_CHARACTER = gql`
  mutation SelectCharacter($characterId:ID!) {
    selectCharacter(characterId: $characterId) @client
  }
`
