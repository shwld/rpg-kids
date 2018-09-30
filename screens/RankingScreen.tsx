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


interface Props {
  navigation: NavigationScreenProp<any, any>
}

const onEndReached = (data) => {
  const { pageInfo: { endCursor, hasNextPage } } = data.acquirementRankingsOfCharacter
  if (!hasNextPage) { return }
  trackEvent('Ranking: onEndReached')
  data.fetchMore({
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

const renderItem = ({ item, index }, props: Props, refetch: Function) => (
  <CharacterCard
    character={item}
    rank={index+1}
    handlePress={() => props.navigation.navigate('Status', {characterId: item.id})}
  />
)

export default (props: Props) => (
  <Component.GetCharacters
    query={Query.GetCharacters}
    fetchPolicy="cache-and-network"
  >
    {({data, refetch, networkStatus, loading, error}) => {
      if (error || !data) {
        return <Error navigation={props.navigation} />
      }
      if (loading) { return <Loading /> }

      return (
        <List>
          <FlatList
            data={data.acquirementRankingsOfCharacter.edges.map(({node}) => ({key: node.id, ...node}))}
            onEndReachedThreshold={30}
            onEndReached={() => onEndReached(data)}
            renderItem={(row) => renderItem(row, props, refetch)}
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={() => refetch({cursor: null})}
          />
        </List>
      )
    }}
  </Component.GetCharacters>
)
