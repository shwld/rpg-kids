import React from 'react';
import {
  Body,
  Text,
  Card,
  CardItem,
  Icon,
  Button,
  Picker,
} from "native-base";
import getAge from '../lib/utils/getAge'
import CharacterIcon from '../components/CharacterIcon'

interface Character {
  id: string
  name: string
  birthday: Date
  description: string
}

interface Props {
  character: Character,
  selectableCharacters?: Character[],
  onChangeCharacter?: (character: Character) => any,
  goGetSkill?: () => any,
}

export default ({character, selectableCharacters, goGetSkill, onChangeCharacter = () => {}}: Props) => (
  <Card style={{flex: 0}}>
    <CardItem style={{justifyContent: 'center', alignItems: 'center'}}>
      <CharacterIcon
        characterId={character.id}
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
        </Picker>
      )}
      {!selectableCharacters && (
        <Text>{character.name}</Text>
      )}
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
