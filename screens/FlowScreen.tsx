import React from "react"
import AcquirementCard from '../components/AcquirementCard'
import { Alert, FlatList } from 'react-native'
import { compose } from 'react-apollo'
import { List } from 'native-base'
import { NavigationScreenProp } from 'react-navigation'
import { NetworkStatus } from 'apollo-client'
import { Component, Query, Graphql } from '../graphql/screens/Flow'
import { trackEvent } from '../lib/analytics'
import Loading from '../components/Loading'
import Error from '../components/Error'
import Toast from '../lib/Toast'


interface Props {
  navigation: NavigationScreenProp<any, any>
  blockAcquirement(payload: { variables: {acquirementId: string}, update: any})
}

const onEndReached = (data) => {
  // FIXME: undefined is not a function (evaluating 'e.fetchMore')

  // const { pageInfo: { endCursor, hasNextPage } } = data.acquirements
  // if (!hasNextPage) { return }
  // trackEvent('Flow: onEndReached')
  // data.fetchMore({
  //   query: Query.GetAcquirements,
  //   variables: { ...data.variables, cursor: endCursor },
  //   updateQuery: (previousResult, { fetchMoreResult }) => {
  //     const newEdges = fetchMoreResult.acquirements.edges
  //     const pageInfo = fetchMoreResult.acquirements.pageInfo

  //     if (!newEdges.length) { return previousResult }

  //     fetchMoreResult.acquirements = {
  //       __typename: previousResult.acquirements.__typename,
  //       edges: [...previousResult.acquirements.edges, ...newEdges],
  //       pageInfo,
  //     }

  //     return fetchMoreResult
  //   }
  // })
}

const block = async (props: Props, acquirementId: string, refetch: Function) => {
  trackEvent('Flow: blockAcquirement')

  const perform = async () => {
    const { navigation, blockAcquirement } = props
    await blockAcquirement({
      variables: {
        acquirementId,
      },
      update: (store, result) => refetch(),
    })
    navigation.pop()
    Toast.success('ブロックしました')
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
      character={item.character}
      onCharacterClick={() => navigation.navigate('Status', {characterId: item.character.id})}
      onAcquirementClick={() => {}}
      onBlockClick={() => block(props, item.id, refetch)}
    />
  )
}

export default compose(
  Graphql.BlockAcquirement<Props>(),
)((props: Props) => (
  <Component.GetAcquirements
    query={Query.GetAcquirements}
    fetchPolicy="cache-and-network"
  >
    {({data, refetch, networkStatus, loading, error}) => {
      if (error || !data) {
        return <Error beforeAction={() => refetch({cursor: null})} navigation={props.navigation} />
      }
      if (loading) { return <Loading /> }

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
