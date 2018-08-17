import React from 'react'

import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { setContext } from "apollo-link-context"
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { ApolloProvider } from 'react-apollo'
import { withClientState } from 'apollo-link-state'
import resolvers from './resolvers'
import defaults from './defaults'
import { getIdToken } from '../lib/auth'

const httpLink = createHttpLink({ uri: 'https://role-playing-g.herokuapp.com/graphql' })
const authLink = setContext(async (_, { headers }) => {
  const token = await getIdToken()
  if (!token) { return { headers } }
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  }
})
const cache = new InMemoryCache({
  dataIdFromObject: (o: any) => o.id
})
const clientLink = withClientState({ resolvers, defaults, cache })

export default class extends React.Component {
  client = new ApolloClient({
    link: ApolloLink.from([
      clientLink,
      authLink.concat(httpLink),
    ]),
    cache,
  })

  render() {
    return (
      <ApolloProvider client={this.client}>
        {this.props.children}
      </ApolloProvider>
    )
  }

}
