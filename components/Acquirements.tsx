import React from 'react'
import {
  Text,
  Card,
  Left,
  Icon,
  List,
  ListItem,
  Right,
  Body,
} from "native-base"
import getAge from '../lib/utils/getAge'

interface Acquirement {
  id: string
  name: string
  acquiredAt: Date
}

interface Props {
  title: string,
  birthday: Date,
  acquirements: Acquirement[],
  goLogs: () => any,
  goSkill: (id: string) => any,
}

export default ({title, birthday, acquirements, goLogs, goSkill}: Props) => (
  <Card style={{flex: 0}}>
    <List style={{ elevation: 3, backgroundColor: 'white' }}>
      <ListItem header itemDivider onPress={() => {goLogs()}}>
        <Left>
          <Text>{title}</Text>
        </Left>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
      {acquirements.map(it => (
        <ListItem key={it.id} onPress={() => {goSkill('')}}>
          <Body>
            <Text>{it.name}</Text>
            <Text note numberOfLines={1}>{getAge(birthday, it.acquiredAt)}ころ</Text>
          </Body>
          {/* <Right>
            <Icon name="arrow-forward" />
          </Right> */}
        </ListItem>
      ))}
    </List>
  </Card>
)
