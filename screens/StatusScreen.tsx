import React from "react"
import { AppLoading } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import {
  View,
} from "native-base"
import Status from '../components/Status'
import Acquirements from '../components/Acquirements'
import getParam from '../lib/utils/getParam'
import isEmpty from '../lib/utils/isEmpty'
import { Component, Query } from '../graphql/screens/Status'

interface Props {
  navigation: NavigationScreenProp<any, any>
}

export default (props: Props) => (
  <Component.GetCharacter
    query={Query.GetCharacter}
    variables={{id: getParam(props, 'characterId')}}
    fetchPolicy="cache-and-network"
  >
    {({data, loading}) => {
      if (isEmpty(data) || !data || loading) {
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
  </Component.GetCharacter>
)
