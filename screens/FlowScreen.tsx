import React from "react";
import { AppLoading } from 'expo'
import AcquirementCard from '../components/AcquirementCard'
import { FlatList, RefreshControl } from 'react-native'
import {
  Content,
} from "native-base";
import gql from 'graphql-tag'
import { NavigationScreenProp } from 'react-navigation'
import { graphql, compose } from 'react-apollo'

interface Props {
  navigation: NavigationScreenProp<any, any>
  data: {
    loading: boolean
    fetchMore: Function
    variables: any
    acquirements: {
      edges: {
        node: {
          id: string
          name: string
          acquiredAt: Date
          createdAt: Date
          character: {
            id: string
            name: string
            birthday: Date
          }
        }
      }[]
      pageInfo: {
        hasNextPage: boolean
        endCursor: boolean
      }
    }
  }
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
`;

class Screen extends React.Component<Props> {
  state = {
    refreshing: false,
  }
  onEndReached() {
    const { data } = this.props
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

  renderItem({ item, index }) {
    return (
      <AcquirementCard
        acquirement={item}
        onClick={() => {}}
      />
    )
  }

  render() {
    const { data } = this.props
    if (data.loading) { return <AppLoading /> }
    return (
      <Content>
        <FlatList
          data={data.acquirements.edges.map(({node}) => ({key: node.id, ...node}))}
          onEndReachedThreshold={30}
          onEndReached={() => this.onEndReached()}
          refreshing={this.state.refreshing}
          renderItem={(row) => this.renderItem(row)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {}}
            />
          }
        />
      </Content>
    )
  }
}

export default compose(
  graphql(GET_ACQUIREMENTS, { name: 'data'}),
)(Screen)

