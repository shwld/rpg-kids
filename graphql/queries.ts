import gql from 'graphql-tag';

export default {
  isSignedIn: (_obj, _args, { cache }: { cache }) => {
    const query = gql`
      query {
        state {
          user {
            isSignedIn
          }
        }
      }
    `;
    const user = cache.readQuery({ query })
    return user.signedIn
  },
}