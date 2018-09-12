import React from 'react'
import {
  Body,
  Text,
  Card,
  CardItem,
  Icon,
  Button,
  Picker,
} from 'native-base'
import getAge from '../lib/utils/getAge'
import CharacterIcon from '../components/CharacterIcon'
import { Character } from '../graphql/types'


interface Props {
  character: Character,
  selectableCharacters?: Character[],
  onChangeCharacter?: (id: string) => any,
  onAddCharacter?: () => any,
  goGetSkill?: () => any,
  goSettings?: () => any,
}

const NEW_CHARACTER_ID = '__new'

export default ({character, selectableCharacters, goGetSkill, goSettings, onChangeCharacter = () => {}, onAddCharacter = () => {}}: Props) => (
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
          onValueChange={(id) => {
            if (id === NEW_CHARACTER_ID) { return onAddCharacter() }
            onChangeCharacter(id)
          }}
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
        <Text>これできた登録</Text>
      </Button>}
    </CardItem>
  </Card>
)
