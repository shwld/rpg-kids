import React from "react";
import { AppLoading } from 'expo'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { NavigationScreenProp } from 'react-navigation'
import format from 'date-fns/format'
import ja from 'date-fns/locale/ja'
import {
  Content,
  Text,
  ListItem,
  Body,
  View,
  Left,
  Right,
} from "native-base";
import { FlatList, RefreshControl } from 'react-native'
import getAge from '../lib/getAge'

interface Props {
  navigation: NavigationScreenProp<any, any>
  options: any
  data: {
    loading: boolean
    fetchMore: Function,
    variables: any,
    character: {
      id: string,
      name: string,
      birthday: Date,
      acquirements: {
        edges: {
          node: {
            id: string
            skillId: string
            name: string
            acquiredAt: Date
          }
          cursor: string
        }[]
        pageInfo: {
          hasNextPage: boolean
          endCursor: boolean
        }
      }
    }
  }
}

interface State {
  refreshing: boolean
  character: {
    id: string
    name: string
    birthday: Date
  }
}

const GET_CHARACTER = gql`
query Character($id:ID = "", $cursor: String) {
  character(id: $id) {
    id
    name
    birthday
    acquirements(first: 30, after: $cursor) {
      edges {
        node {
          id
          skillId
          name
          acquiredAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
`;

class Screen extends React.Component<Props, State> {
  state = {
    refreshing: false,
    character: {
      id: '',
      name: '',
      birthday: new Date(),
    }
  }

  componentWillReceiveProps(newProps) {
    const { data } = newProps
    if (data.loading) { return }
    this.setState({ character: data.character })
  }

  onEndReached() {
    const { data } = this.props
    const { pageInfo: { endCursor, hasNextPage } } = data.character.acquirements
    if (!hasNextPage) { return }
      data.fetchMore({
        query: GET_CHARACTER,
        variables: { ...data.variables, cursor: endCursor },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.character.acquirements.edges;
          const pageInfo = fetchMoreResult.character.acquirements.pageInfo;

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

  renderItem({ item, index }) {
    const { birthday } = this.state.character
    return (
      <View>
        <ListItem>
          <Left>
            <Body>
              <Text>{item.name}</Text>
              <Text note numberOfLines={1}>{getAge(birthday, item.acquiredAt)}ころ</Text>
            </Body>
          </Left>
          <Right>
            <Text note numberOfLines={1}>{format(item.acquiredAt, 'MMMDo', {locale: ja})}</Text>
          </Right>
        </ListItem>
      </View>
    )
  }

  render() {
    const { data } = this.props
    if (data.loading) { return <AppLoading /> }
    const { edges } = data.character.acquirements
    return (
      <Content>
        <FlatList
          data={edges.map(({node}) => ({key: node.id, ...node}))}
          onEndReachedThreshold={100}
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
  graphql(GET_CHARACTER, {
    name: 'data',
    props: (props: any) => {
      props.data.variables.id = props.ownProps.navigation.getParam('characterId', '')
      return props
    },
  }),
)(Screen)

