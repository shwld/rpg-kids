import React from "react"
import { AppLoading } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import formatFromDate from '../lib/utils/formatFromDate'
import {
  List,
  Text,
  ListItem,
  Body,
  View,
  Left,
  Right,
} from "native-base"
import { FlatList } from 'react-native'
import { NetworkStatus } from 'apollo-client'
import getAge from '../lib/utils/getAge'
import isEmpty from '../lib/utils/isEmpty'
import getParam from '../lib/utils/getParam'
import { Component, Query } from '../graphql/screens/Log'

interface Props {
  navigation: NavigationScreenProp<any, any>
}

const onEndReached = (data) => {
  const { pageInfo: { endCursor, hasNextPage } } = data.character.acquirements
  if (!hasNextPage) { return }
  data.fetchMore({
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
    <View>
      <ListItem onPress={() => navigation.navigate('EditAcquirement', { acquirementId: item.id, characterId: character.id})}>
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
    </View>
  )
}

export default (props: Props) => (
  <Component.GetCharacter
    query={Query.GetCharacter}
    variables={{id: getParam(props, 'characterId'), cursor: null}}
    fetchPolicy="cache-and-network"
  >
    {({data, refetch, networkStatus, loading}) => {
      if (loading) { return <AppLoading /> }

      if (isEmpty(data) || !data || data.character.acquirements.edges.length === 0) {
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
            onEndReached={() => onEndReached(data)}
            renderItem={(row) => renderItem(row, data.character, props.navigation)}
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={() => refetch({id: getParam(props, 'characterId'), cursor: null})}
          />
        </List>
      )
    }}
  </Component.GetCharacter>
)
