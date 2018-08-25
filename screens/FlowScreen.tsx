import React from "react"
import { AppLoading } from 'expo'
import AcquirementCard from '../components/AcquirementCard'
import { FlatList } from 'react-native'
import { List } from "native-base"
import { NavigationScreenProp } from 'react-navigation'
import { NetworkStatus } from 'apollo-client'
import isEmpty from '../lib/utils/isEmpty'
import { Component, Query } from '../graphql/screens/Flow'

interface Props {
  navigation: NavigationScreenProp<any, any>
}

const onEndReached = (data) => {
  const { pageInfo: { endCursor, hasNextPage } } = data.acquirements
  if (!hasNextPage) { return }
  data.fetchMore({
    query: Query.GetAcquirements,
    variables: { ...data.variables, cursor: endCursor },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const newEdges = fetchMoreResult.acquirements.edges
      const pageInfo = fetchMoreResult.acquirements.pageInfo

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
  <Component.GetAcquirements
    query={Query.GetAcquirements}
    fetchPolicy="cache-and-network"
    pollInterval={15000}
  >
    {({data, refetch, networkStatus, loading}) => {
      if (isEmpty(data) || !data || loading) {
        return <AppLoading />
      }

      return (
        <List>
          <FlatList
            data={data.acquirements.edges.map(({node}) => ({key: node.id, ...node}))}
            onEndReachedThreshold={30}
            onEndReached={() => onEndReached(data)}
            renderItem={(row) => renderItem(row, navigation)}
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={() => refetch({cursor: null})}
          />
        </List>
      )
    }}
  </Component.GetAcquirements>
)
