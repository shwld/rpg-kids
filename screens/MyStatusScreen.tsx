import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import Acquirements from '../components/Acquirements'
import CharacterStatus from '../containers/CharacterStatus'


interface Props {
  navigation: NavigationScreenProp<any, any>
}

export default (props: Props) => (
  <CharacterStatus
    navigation={props.navigation}
    render={({character, acquirements}) => (
      <Acquirements
        title="最近できるようになったこと"
        birthday={character.birthday}
        acquirements={acquirements}
        goLogs={() => props.navigation.navigate('Log', { characterId: character.id })}
        goSkill={id => props.navigation.navigate('MyAcquirement', { acquirementId: id, characterId: character.id})}
      ></Acquirements>
    )}
  />
)
