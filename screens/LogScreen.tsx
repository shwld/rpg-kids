import React from "react"
import { AppLoading } from 'expo'
import { Query } from 'react-apollo'
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
import { FlatList } from 'react-native'
import getAge from '../lib/getAge'
import isEmpty from '../lib/utils/isEmpty'

interface Props {
  navigation: NavigationScreenProp<any, any>
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

class Screen extends React.Component<Props> {
  onEndReached(data) {
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

  renderItem({ item, index }, birthday) {
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
    const id = this. props.navigation.getParam('characterId', '')
    return (
      <Query query={GET_CHARACTER} variables={{id}} fetchPolicy="cache-and-network">
        {({data}) => {
          if (isEmpty(data) || data.loading) {
            return <AppLoading />
          }
          return <Content>
            <FlatList
              data={data.character.acquirements.edges.map(({node}) => ({key: node.id, ...node}))}
              onEndReachedThreshold={30}
              onEndReached={() => this.onEndReached(data)}
              renderItem={(row) => this.renderItem(row, data.character.birthday)}
            />
          </Content>
        }}
      </Query>
    )
  }
}

export default Screen
