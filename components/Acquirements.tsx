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
} from 'native-base'
import getAge from '../lib/utils/getAge'
import styles from '../styles';

interface Acquirement {
  id: string
  name: string
  acquiredAt: Date
}

interface Props {
  title: string,
  birthday: Date,
  acquirements: Acquirement[],
  goLogs?: () => any,
  goSkill?: (id: string) => any,
}

export default ({title, birthday, acquirements, goLogs, goSkill}: Props) => (
  <Card style={{flex: 0}}>
    <List style={{ elevation: 3, backgroundColor: 'white' }}>
      <ListItem header itemDivider onPress={() => {goLogs ? goLogs() : () => {}}}>
        <Left>
          <Text>{title}</Text>
        </Left>
        {goLogs && <Right>
          <Icon name="arrow-forward" />
        </Right>}
      </ListItem>
      {acquirements.length === 0 && (
        <ListItem>
          <Body style={styles.stretch}>
            <Text note>まだ何も記録されていないよ</Text>
            <Text note>「記録」からできたことを登録しよう！</Text>
          </Body>
        </ListItem>
      )}
      {acquirements.map(it => (
        <ListItem key={it.id} onPress={() => goSkill ? goSkill(it.id) : {}}>
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
