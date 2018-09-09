import React from "react"
import { AppLoading } from 'expo'
import AcquirementCard from '../components/AcquirementCard'
import { Alert, FlatList } from 'react-native'
import { compose } from 'react-apollo'
import { List, Toast } from "native-base"
import { NavigationScreenProp } from 'react-navigation'
import { NetworkStatus } from 'apollo-client'
import isEmpty from '../lib/utils/isEmpty'
import { Component, Query, Graphql } from '../graphql/screens/Flow'
import { trackEvent } from '../lib/analytics'

interface Props {
  navigation: NavigationScreenProp<any, any>
  blockAcquirement(payload: { variables: {acquirementId: string}, update: any})
  setInProgress(payload: { variables: {inProgress: boolean}})
}

const onEndReached = (data) => {
  const { pageInfo: { endCursor, hasNextPage } } = data.acquirements
  if (!hasNextPage) { return }
  trackEvent('Flow: onEndReached')
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

const block = async (props: Props, acquirementId: string, refetch: Function) => {
  trackEvent('Flow: blockAcquirement')

  const perform = async () => {
    const { navigation, blockAcquirement, setInProgress } = props
    setInProgress({variables: { inProgress: true }})
    try {
      await blockAcquirement({
        variables: {
          acquirementId,
        },
        update: (store, result) => refetch(),
      })
      navigation.pop()
    } catch (e) {
      throw e
    } finally {
      setInProgress({variables: { inProgress: false }})
    }
    Toast.show({
      text: 'ブロックしました',
      buttonText: 'OK',
      position: 'top',
    })
  }
  
  Alert.alert(
    'ブロックします',
    'よろしいですか?',
    [
      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      {text: 'OK', onPress: () => perform()},
    ],
  )
}

const renderItem = ({ item, index }, props: Props, refetch: Function) => {
  const { navigation } = props
  return (
    <AcquirementCard
      acquirement={item}
      onCharacterClick={() => navigation.navigate('Status', {characterId: item.character.id})}
      onAcquirementClick={() => {}}
      onBlockClick={() => block(props, item.id, refetch)}
    />
  )
}

export default compose(
  Graphql.BlockAcquirement<Props>(),
  Graphql.SetInProgress(),
)(props => (
  <Component.GetAcquirements
    query={Query.GetAcquirements}
    fetchPolicy="cache-and-network"
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
            renderItem={(row) => renderItem(row, props, refetch)}
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={() => refetch({cursor: null})}
          />
        </List>
      )
    }}
  </Component.GetAcquirements>
))
