import React from "react"
import { AppLoading } from 'expo'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { NavigationScreenProp } from 'react-navigation'
import format from 'date-fns/format'
import ja from 'date-fns/locale/ja'
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
import { Data, Character } from '../graphql/types'

interface Props {
  navigation: NavigationScreenProp<any, any>
}

interface GetCharacterType extends Data {
  character: Character
}
interface Variables {
  id: string
  cursor: string|null
}
class GetCharacter extends Query<GetCharacterType, Variables> {}
const GET_CHARACTER = gql`
query Character($id:ID = "", $cursor: String) {
  character(id: $id) {
    id
    name
    birthday
    imageUrl
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
`

const onEndReached = (data) => {
  const { pageInfo: { endCursor, hasNextPage } } = data.character.acquirements
  if (!hasNextPage) { return }
  data.fetchMore({
    query: GET_CHARACTER,
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
          <Text note numberOfLines={1}>{format(item.acquiredAt, 'MMMDo', {locale: ja})}</Text>
        </Right>
      </ListItem>
    </View>
  )
}

export default (props: Props) => (
  <GetCharacter
    query={GET_CHARACTER}
    variables={{id: getParam(props, 'characterId'), cursor: null}}
    fetchPolicy="cache-and-network"
  >
    {response => {
      const {data, refetch, networkStatus} = response
      if (isEmpty(data) || !data || data.loading) {
        return <AppLoading />
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
  </GetCharacter>
)
