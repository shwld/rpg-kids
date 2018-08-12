import React from 'react';
import {
  Body,
  Text,
  Card,
  CardItem,
  Left,
  Right,
  Button,
} from "native-base";
import CharacterIcon from './CharacterIcon'
import getAge from '../lib/getAge'
import styles from '../styles'

interface Props {
  acquirement: {
    name: string
    postedAt: string
    character: {
      id: string
      name: string
      birthday: string
    }
  }
  onClick: Function
}

export default ({ acquirement, onClick }: Props) => (
  <Card>
    <CardItem>
      <CharacterIcon characterId={acquirement.character.id} style={{marginRight: 20}} />
      <Body style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
        <Text>{acquirement.character.name}</Text>
        <Text note numberOfLines={1}>{getAge(acquirement.character.birthday, acquirement.postedAt)}ころ</Text>
      </Body>
   </CardItem>
    <CardItem>
      <Body style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
        <Button primary rounded small onPress={() => onClick()}>
          <Text>{acquirement.name}</Text>
        </Button>
        <Text style={{marginLeft: 10}}>できた！</Text>
      </Body>
    </CardItem>
    {/* <CardItem style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
      <Icon name="heart" style={{ color: '#ED4A6A' }} />
    </CardItem> */}
  </Card>
)
