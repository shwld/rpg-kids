import React from "react"
import { AppLoading } from 'expo'
import { Query } from 'react-apollo'
import { NavigationScreenProp } from 'react-navigation'
import gql from 'graphql-tag'
import {
  View,
} from "native-base"
import Status from '../components/Status'
import Acquirements from '../components/Acquirements'
import getParam from '../lib/utils/getParam'
import isEmpty from '../lib/utils/isEmpty'
import { Data, Character } from '../graphql/types'

interface Props {
  navigation: NavigationScreenProp<any, any>
}

interface GetCharacterType extends Data {
  character: Character
}
interface Variables {
  id: string
}
class GetCharacter extends Query<GetCharacterType, Variables> {}
const GET_CHARACTER = gql`
query GetCharacter($id:ID = "") {
  character(id: $id) {
    id
    name
    birthday
    description
    acquirements(first: 5) {
      edges {
        node {
          id
          name
          acquiredAt
        }
      }
    }
  }
}
`

export default (props: Props) => (
  <GetCharacter
    query={GET_CHARACTER}
    variables={{id: getParam(props, 'characterId')}}
    fetchPolicy="cache-and-network"
  >
    {({data}) => {
      if (isEmpty(data) || !data || data.loading) {
        return <AppLoading />
      }

      const character = data.character
      const acquirements = character.acquirements.edges.map(it => it.node)

      return <View>
        <Status character={character} />
        <Acquirements
          title="最近できるようになったこと"
          birthday={character.birthday}
          acquirements={acquirements}
          goLogs={() => props.navigation.navigate('Log', { characterId: character.id })}
          goSkill={() => {}}
        />
      </View>
    }}
  </GetCharacter>
)
