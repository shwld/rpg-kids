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
}