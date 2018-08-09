import React from 'react';
import format from 'date-fns/format'
import {
  Body,
  Text,
  Card,
  CardItem,
  Thumbnail,
  Icon,
  Button,
  Picker,
} from "native-base";

interface Character {
  id: string
  name: string
  birthday: Date
  description: string
}

interface Props {
  character: Character,
  selectableCharacters: Character[],
  onChangeCharacter: (character: Character) => any,
  goGetSkill: () => any,
}

export default ({character, selectableCharacters, goGetSkill, onChangeCharacter}: Props) => (
  <Card style={{flex: 0}}>
    <CardItem style={{justifyContent: 'center', alignItems: 'center'}}>
      <Thumbnail
        source={{ uri: `https://randomuser.me/api/portraits/women/${(Math.floor(Math.random()*(100+1-1))+1)}.jpg` }}
        style={{marginRight: 20}}
      />
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
    </CardItem>
    <CardItem style={{justifyContent: 'space-around', alignItems: 'center'}}>
      <Body style={{flexDirection: 'column', justifyContent: 'space-around'}}>
        <Text note>{format(character.birthday, 'M月D日生まれ')}</Text>
        <Text>{character.description}</Text>
      </Body>
      <Button bordered onPress={() => goGetSkill()}>
        <Text>これできた</Text>
      </Button>
    </CardItem>
  </Card>
)
