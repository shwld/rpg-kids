import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import { View, Body, Text } from 'native-base'
import Acquirements from '../components/Acquirements'
import CharacterStatus from '../containers/CharacterStatus'
import styles from '../styles'


interface Props {
  navigation: NavigationScreenProp<any, any>
}

export default (props: Props) => (
  <CharacterStatus
    navigation={props.navigation}
    render={({character, acquirements}) => (
      <View>
        <Acquirements
          title="次にできるようになること"
          birthday={character.birthday}
          acquirements={acquirements}
          emptyItemRender={() => (
            <Body style={styles.stretch}>
              <Text note>データが足りないようです</Text>
            </Body>
          )}
        ></Acquirements>
        <Acquirements
          title="最近できるようになったこと"
          birthday={character.birthday}
          acquirements={acquirements}
          goLogs={() => props.navigation.navigate('Log', { characterId: character.id })}
          goSkill={id => props.navigation.navigate('MyAcquirement', { acquirementId: id, characterId: character.id})}
        ></Acquirements>
      </View>
    )}
  />
)
