import React from "react"
import { FlatList } from 'react-native'
import { List } from 'native-base'
import { NavigationScreenProp } from 'react-navigation'
import { NetworkStatus } from 'apollo-client'
import { Component, Query } from '../graphql/screens/Ranking'
import { trackEvent } from '../lib/analytics'
import Loading from '../components/Loading'
import Error from '../components/Error'
import CharacterCard from '../components/CharacterCard'
import tryGet from '../lib/utils/tryGet'


interface Props {
  navigation: NavigationScreenProp<any, any>
}

const onEndReached = (data, fetchMore) => {
  const { pageInfo: { endCursor, hasNextPage } } = data.acquirementRankingsOfCharacter
  if (!hasNextPage) { return }
  trackEvent('Ranking: onEndReached')
  fetchMore({
    query: Query.GetCharacters,
    variables: { ...data.variables, cursor: endCursor },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const newEdges = fetchMoreResult.acquirementRankingsOfCharacter.edges
      const pageInfo = fetchMoreResult.acquirementRankingsOfCharacter.pageInfo

      if (!newEdges.length) { return previousResult }

      fetchMoreResult.acquirementRankingsOfCharacter = {
        __typename: previousResult.acquirementRankingsOfCharacter.__typename,
        edges: [...previousResult.acquirementRankingsOfCharacter.edges, ...newEdges],
        pageInfo,
      }

      return fetchMoreResult
    }
  })
}

const renderItem = ({ item }, props: Props) => (
  <CharacterCard
    character={item}
    handlePress={() => props.navigation.navigate('Status', {characterId: item.id})}
  />
)

export default (props: Props) => (
  <Component.GetCharacters
    query={Query.GetCharacters}
    fetchPolicy="cache-and-network"
  >
    {({data, refetch, networkStatus, loading, error, fetchMore}) => {
      if (error || !data) {
        return <Error beforeAction={() => refetch({cursor: null})} navigation={props.navigation} />
      }

      let list = tryGet(() => data.acquirementRankingsOfCharacter.edges.map(({node}) => ({key: node.id, ...node})))
      if (!list) { return <Loading /> }
      return (
        <List>
          <FlatList
            data={list}
            onEndReachedThreshold={30}
            onEndReached={() => !loading && onEndReached(data, fetchMore)}
            renderItem={(row) => renderItem(row, props)}
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={() => refetch({cursor: null})}
          />
        </List>
      )
    }}
  </Component.GetCharacters>
)
