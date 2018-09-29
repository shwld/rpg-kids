import React from 'react'
import { Alert } from 'react-native'
import {
  Body,
  Text,
  Card,
  CardItem,
  Icon,
  Button,
  Picker,
  ActionSheet,
} from 'native-base'
import getAge from '../lib/utils/getAge'
import CharacterIcon from '../components/CharacterIcon'
import { Character } from '../graphql/types'
import theme from '../native-base-theme/variables/platform'

interface OptionActions {
  editCharacter: () => any,
  removeCharacter: () => any,
  invite: () => any,
}

interface Props {
  character: Character,
  selectableCharacters?: Character[],
  changeCharacter?: (id: string) => any,
  addCharacter?: () => any,
  options?: OptionActions,
  canAddCharacter?: boolean
}

const NEW_CHARACTER_ID = '__new'

const selectAction = (options: OptionActions) => {
  ActionSheet.show(
    {
      options: [
        { text: '編集する', icon: 'ios-cog', iconColor: theme.brandDark },
        { text: '親を招待する', icon: 'ios-share-alt', iconColor: theme.brandDark },
        { text: '削除する', icon: 'ios-remove-circle', iconColor: theme.brandDanger },
        { text: 'キャンセル', icon: 'ios-close', iconColor: theme.brandDark }
      ],
      cancelButtonIndex: 3,
      title: `子供の情報に対するアクションを選択`,
    },
    async buttonIndex => {
      switch(buttonIndex) {
        case 0:
          options.editCharacter()
          return
        case 1:
          options.invite()
          return
        case 2:
          Alert.alert(
            '削除します',
            'よろしいですか?',
            [
              {text: 'Cancel', onPress: () => {}, style: 'cancel'},
              {text: 'OK', onPress: () => options.removeCharacter()},
            ],
          )
          return
        default:
          return
      }
    }
  )
}

const makeSelections = (characters: any[], canAddCharacter?: boolean) => (
  characters.concat(canAddCharacter !== false ? [{name: '子供を追加', id: NEW_CHARACTER_ID}] : [])
)

export default ({character, selectableCharacters, addCharacter = () => {}, changeCharacter = () => {}, options, canAddCharacter}: Props) => (
  <Card style={{flex: 0}}>
    <CardItem style={{justifyContent: 'center', alignItems: 'center'}}>
      <CharacterIcon
        uri={character.imageUrl}
        style={{marginRight: 20}}
      />
      {selectableCharacters && (
        <Picker
          mode='dropdown'
          iosHeader='子供を選択'
          iosIcon={<Icon name='ios-arrow-down-outline' />}
          style={{ width: undefined }}
          selectedValue={character.id}
          onValueChange={id => {
            if (id === NEW_CHARACTER_ID) { return addCharacter() }
            changeCharacter(id)
          }}>
          {makeSelections(selectableCharacters, canAddCharacter).map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))}
        </Picker>
      )}
      {!selectableCharacters && (
        <Text>{character.name}</Text>
      )}
      {options && <Icon name="settings" onPress={() => selectAction(options)} />}
    </CardItem>
    {options && <CardItem style={{justifyContent: 'space-around', alignItems: 'center'}}>
      <Body style={{flexDirection: 'column', justifyContent: 'space-around'}}>
        <Text note>{getAge(character.birthday, new Date())}</Text>
        <Text>{character.description}</Text>
      </Body>
    </CardItem>}
  </Card>
)
