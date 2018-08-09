import React from 'react';
import {
  Text,
  Card,
  Left,
  Icon,
  List,
  ListItem,
  Right,
} from "native-base";

interface Skill {
  id: string
  name: string
  birthday: Date
  description: string
}

interface Props {
  title: string,
  skills: Skill[],
  goLogs: () => any,
  goSkill: (id: string) => any,
}

export default ({title, skills, goLogs, goSkill}: Props) => (
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
      <ListItem onPress={() => {goSkill('')}}>
        <Left>
          <Text>自分を中心にして回転できた</Text>
        </Left>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
      <ListItem>
        <Left>
          <Text>手を離して立てた</Text>
        </Left>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
      <ListItem>
        <Left>
          <Text>ハイハイできた</Text>
        </Left>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    </List>
  </Card>
)
