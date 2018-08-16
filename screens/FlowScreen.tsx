import React from "react"
import { AppLoading } from 'expo'
import AcquirementCard from '../components/AcquirementCard'
import { FlatList } from 'react-native'
import {
  Content,
} from "native-base";
import gql from 'graphql-tag'
import { NavigationScreenProp } from 'react-navigation'
import { Query } from 'react-apollo'
import isEmpty from '../lib/utils/isEmpty'


interface Props {
  navigation: NavigationScreenProp<any, any>
}

const GET_ACQUIREMENTS = gql`
query Acquirements($cursor: String) {
  acquirements(first: 30, after: $cursor) {
    edges {
      node {
        id
        name
        acquiredAt
        character {
          id
          name
          birthday
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`

const onEndReached = (data) => {
  const { pageInfo: { endCursor, hasNextPage } } = data.acquirements
  if (!hasNextPage) { return }
  data.fetchMore({
    query: GET_ACQUIREMENTS,
    variables: { ...data.variables, cursor: endCursor },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const newEdges = fetchMoreResult.acquirements.edges;
      const pageInfo = fetchMoreResult.acquirements.pageInfo;

      if (!newEdges.length) { return previousResult }

      fetchMoreResult.acquirements = {
        __typename: previousResult.acquirements.__typename,
        edges: [...previousResult.acquirements.edges, ...newEdges],
        pageInfo,
      }

      return fetchMoreResult
    }
  })
}

const renderItem = ({ item, index }, navigation) => {
  return (
    <AcquirementCard
      acquirement={item}
      onCharacterClick={() => {
        navigation.navigate('Status', {characterId: item.character.id})
      }}
      onAcquirementClick={() => {}}
    />
  )
}

export default ({navigation}: Props) => (
  <Query query={GET_ACQUIREMENTS} fetchPolicy="cache-and-network">
    {({data}) => {
      if (isEmpty(data) || data.loading) {
        return <AppLoading />
      }

      return (
        <Content>
          <FlatList
            data={data.acquirements.edges.map(({node}) => ({key: node.id, ...node}))}
            onEndReachedThreshold={30}
            onEndReached={() => onEndReached(data)}
            renderItem={(row) => renderItem(row, navigation)}
          />
        </Content>
      )
    }}
  </Query>
)
