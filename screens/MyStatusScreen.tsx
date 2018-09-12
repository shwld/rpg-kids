import React from "react"
import { AppLoading } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import {
  Content,
  Text,
  Body,
  Button,
} from 'native-base'
import Status from '../components/Status'
import Acquirements from '../components/Acquirements'
import isEmpty from '../lib/utils/isEmpty'
import { Query, Component, Getter, Graphql } from '../graphql/screens/MyStatus'


interface Props {
  navigation: NavigationScreenProp<any, any>
  selectCharacter(payload: { variables: {characterId: string}})
}

export default Graphql.SelectCharacter<Props>()(
  (props) => (
    <Component.GetUser query={Query.GetUser} fetchPolicy="cache-and-network">
      {({data, loading}) => {
        if (isEmpty(data) || !data || loading) {
          return <AppLoading />
        }
  
        const characters = data.user.characters.edges.map(it => it.node)
        const character = Getter.getCurrentCharacter(data)
  
        if (!character) {
          return (
            <Body style={{justifyContent: 'center', alignItems: 'stretch'}}>
              <Text note style={{textAlign: 'center'}}>まずは子供の情報を登録しよう</Text>
              <Button block onPress={() => props.navigation.navigate('AddCharacter')}>
                <Text>子供を登録する</Text>
              </Button>
            </Body>
          )
        }
  
        const acquirements: any[] = character.acquirements.edges.map(it => it.node)
  
        return (
          <Content>
            <Status
              character={character}
              selectableCharacters={characters}
              goGetSkill={() => props.navigation.navigate('AcquireSkill', {characterId: character.id})}
              goSettings={() => props.navigation.navigate('EditCharacter', {characterId: character.id})}
              onChangeCharacter={characterId => props.selectCharacter({variables: {characterId}})}
              onAddCharacter={() => props.navigation.navigate('AddCharacter')}
            ></Status>
            <Acquirements
              title="最近できるようになったこと"
              birthday={character.birthday}
              acquirements={acquirements}
              goLogs={() => props.navigation.navigate('Log', { characterId: character.id })}
              goSkill={id => props.navigation.navigate('EditAcquirement', { acquirementId: id, characterId: character.id})}
            ></Acquirements>
          </Content>
        )
      }}
    </Component.GetUser>
  )
)
