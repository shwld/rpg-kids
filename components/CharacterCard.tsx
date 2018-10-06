import React from 'react'
import {
  Body,
  Text,
  Card,
  CardItem,
} from 'native-base'
import getAge from '../lib/utils/getAge'
import CharacterIcon from '../components/CharacterIcon'
import { Character } from '../graphql/types'
import styles from '../styles'


interface Props {
  character: Character
  handlePress?: () => {}
}

export default ({character, handlePress}: Props) => (
  <Card style={{flex: 0}}>
    <CardItem button onPress={() => handlePress ? handlePress() : {}} style={{justifyContent: 'flex-start', alignItems: 'center'}}>
      <CharacterIcon
        uri={character.imageUrl}
        style={{marginRight: 20}}
      />
      <Body style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
        <Text style={styles.w100}>{character.name}</Text>
        <Text note numberOfLines={1} style={styles.w100}>{getAge(character.birthday)}</Text>
        <Text note numberOfLines={1} style={styles.w100}>できること: {character.acquirementsCount}個</Text>
      </Body>
    </CardItem>
  </Card>
)
