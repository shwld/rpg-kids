import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import formatFromDate from '../lib/utils/formatFromDate'
import {
  List,
  Text,
  ListItem,
  Body,
  Left,
  Right,
} from 'native-base'
import { FlatList } from 'react-native'
import { NetworkStatus } from 'apollo-client'
import getAge from '../lib/utils/getAge'
import getParam from '../lib/utils/getParam'
import { Component, Query } from '../graphql/screens/Log'
import { trackEvent } from '../lib/analytics'
import Loading from '../components/Loading'
import Error from '../components/Error'


interface Props {
  navigation: NavigationScreenProp<any, any>
}

const onEndReached = (data, fetchMore) => {
  const { pageInfo: { endCursor, hasNextPage } } = data.character.acquirements
  if (!hasNextPage) { return }
  trackEvent('Log: onEndReached')
  fetchMore({
    query: Query.GetCharacter,
    variables: { ...data.variables, cursor: endCursor },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const newEdges = fetchMoreResult.character.acquirements.edges
      const pageInfo = fetchMoreResult.character.acquirements.pageInfo

      if (!newEdges.length) { return previousResult }

      fetchMoreResult.character.acquirements = {
        __typename: previousResult.character.acquirements.__typename,
        edges: [...previousResult.character.acquirements.edges, ...newEdges],
        pageInfo,
      }

      return fetchMoreResult
    }
  })
}

const renderItem = ({ item, index }, character: { id: string, birthday: Date}, navigation: NavigationScreenProp<any, any>) => {
  return (
    <ListItem onPress={() => navigation.navigate('MyAcquirement', { acquirementId: item.id, characterId: character.id})}>
      <Left>
        <Body>
          <Text>{item.name}</Text>
          <Text note numberOfLines={1}>{getAge(character.birthday, item.acquiredAt)}ころ</Text>
        </Body>
      </Left>
      <Right>
        <Text note numberOfLines={1}>{formatFromDate(item.acquiredAt, 'MMMDo')}</Text>
      </Right>
    </ListItem>
  )
}

export default (props: Props) => (
  <Component.GetCharacter
    query={Query.GetCharacter}
    variables={{id: getParam(props, 'characterId'), cursor: null}}
    fetchPolicy="cache-and-network"
  >
    {({data, refetch, networkStatus, loading, error, fetchMore}) => {
      if (error || !data) {
        return <Error navigation={props.navigation} />
      }
      if (loading) { return <Loading /> }

      if (data.character.acquirements.edges.length === 0) {
        return (
          <Body style={{justifyContent: 'center', alignItems: 'stretch'}}>
            <Text onPress={() => props.navigation.pop()} note style={{textAlign: 'center'}}>まだ何もできないみたいだね</Text>
            <Text onPress={() => props.navigation.pop()} note style={{textAlign: 'center'}}>できたことを登録しよう！</Text>
          </Body>
        )
      }

      return (
        <List>
          <FlatList
            data={data.character.acquirements.edges.map(({node}) => ({key: node.id, ...node}))}
            onEndReachedThreshold={30}
            onEndReached={() => onEndReached(data, fetchMore)}
            renderItem={(row) => renderItem(row, data.character, props.navigation)}
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={() => refetch({id: getParam(props, 'characterId'), cursor: null})}
          />
        </List>
      )
    }}
  </Component.GetCharacter>
)
