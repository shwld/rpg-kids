import React from "react"
import { AppLoading } from 'expo'
import { graphql } from 'react-apollo'
import { NavigationScreenProp } from 'react-navigation'
import {
  View,
} from "native-base"
import Status, { NEW_CHARACTER_ID } from '../components/Status'
import Acquirements from '../components/Acquirements'
import isEmpty from '../lib/utils/isEmpty'
import { SELECT_CHARACTER } from '../graphql/mutations'
import { Query, Component, Getter } from '../graphql/screens/MyStatus'

interface Props {
  navigation: NavigationScreenProp<any, any>
  selectCharacter(payload: { variables: {characterId: string}})
}

const Screen = (props: Props) => (
  <Component.GetUser query={Query.GetUser} fetchPolicy="cache-and-network">
    {({data}) => {
      if (isEmpty(data) || !data ||  data.loading) {
        return <AppLoading />
      }

      const characters = data.user.characters.edges.map(it => it.node)
      const character = Getter.getCurrentCharacter(data)

      if (!character) {
        props.navigation.replace('AddCharacter')
        return
      }

      const acquirements: any[] = character.acquirements.edges.map(it => it.node)

      return (
        <View>
          <Status
            character={character}
            selectableCharacters={characters}
            goGetSkill={() => props.navigation.navigate('AcquireSkill', {characterId: character.id})}
            goSettings={() => props.navigation.navigate('EditCharacter', {characterId: character.id})}
            onChangeCharacter={async characterId => {
              if (characterId === NEW_CHARACTER_ID) {
                props.navigation.navigate('AddCharacter')
                return
              }
              await props.selectCharacter({variables: {characterId}})
            }}
          ></Status>
          <Acquirements
            title="最近できるようになったこと"
            birthday={character.birthday}
            acquirements={acquirements}
            goLogs={() => props.navigation.navigate('Log', { characterId: character.id })}
            goSkill={id => props.navigation.navigate('EditAcquirement', { acquirementId: id, characterId: character.id})}
          ></Acquirements>
        </View>
      )
    }}
  </Component.GetUser>
)

export default graphql<Props>(SELECT_CHARACTER, { name: 'selectCharacter'})(Screen)

