import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import {
  Content,
} from 'native-base'
import Status from '../components/Status'
import Acquirements from '../components/Acquirements'
import getParam from '../lib/utils/getParam'
import isEmpty from '../lib/utils/isEmpty'
import { Component, Query } from '../graphql/screens/Status'
import Loading from '../components/Loading'
import Error from '../components/Error'


interface Props {
  navigation: NavigationScreenProp<any, any>
}

export default (props: Props) => (
  <Component.GetCharacter
    query={Query.GetCharacter}
    variables={{id: getParam(props, 'characterId')}}
    fetchPolicy="cache-and-network"
  >
    {({data, loading, error}) => {
      if (error || !data) {
        return <Error navigation={props.navigation} />
      }
      if (isEmpty(data) || loading) {
        return <Loading />
      }

      const character = data.character
      const acquirements = character.acquirements.edges.map(it => it.node)

      return (
        <Content>
          <Status character={character} />
          <Acquirements
            title="最近できるようになったこと"
            birthday={character.birthday}
            acquirements={acquirements}
            goSkill={() => {}}
          />
        </Content>
      )
    }}
  </Component.GetCharacter>
)
