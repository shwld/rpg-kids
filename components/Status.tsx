import React from 'react'
import {
  Body,
  Text,
  Card,
  CardItem,
  Icon,
  Button,
  Picker,
} from "native-base"
import getAge from '../lib/utils/getAge'
import CharacterIcon from '../components/CharacterIcon'

interface Character {
  id: string
  name: string
  birthday: Date
  description: string
  imageUrl: string
}

interface Props {
  character: Character,
  selectableCharacters?: Character[],
  onChangeCharacter?: (id: string) => any,
  goGetSkill?: () => any,
  goSettings?: () => any,
}

export const NEW_CHARACTER_ID = '__new'

export default ({character, selectableCharacters, goGetSkill, goSettings, onChangeCharacter = () => {}}: Props) => (
  <Card style={{flex: 0}}>
    <CardItem style={{justifyContent: 'center', alignItems: 'center'}}>
      <CharacterIcon
        uri={character.imageUrl}
        style={{marginRight: 20}}
      />
      {selectableCharacters && (
        <Picker
          mode="dropdown"
          iosHeader="子供を選択"
          iosIcon={<Icon name="ios-arrow-down-outline" />}
          style={{ width: undefined }}
          selectedValue={character.id}
          onValueChange={(v) => onChangeCharacter(v)}
        >
          {selectableCharacters.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))}
          <Picker.Item label="子供を追加" value={NEW_CHARACTER_ID} />
        </Picker>
      )}
      {!selectableCharacters && (
        <Text>{character.name}</Text>
      )}
      {goSettings && <Icon name="settings" onPress={() => goSettings()} />}
    </CardItem>
    <CardItem style={{justifyContent: 'space-around', alignItems: 'center'}}>
      <Body style={{flexDirection: 'column', justifyContent: 'space-around'}}>
        <Text note>{getAge(character.birthday, new Date())}</Text>
        <Text>{character.description}</Text>
      </Body>
      {goGetSkill && <Button bordered onPress={() => goGetSkill()}>
        <Text>これできた</Text>
      </Button>}
    </CardItem>
  </Card>
)
