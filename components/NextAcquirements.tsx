import React from 'react'
import {
  Text,
  Card,
  Left,
  List,
  ListItem,
  Body,
} from 'native-base'
import styles from '../styles';

interface Acquirement {
  id: string
  name: string
  acquiredAt: Date
}

interface Props {
  title: string,
  acquirements: Acquirement[],
}

export default ({title, acquirements}: Props) => (
  <Card style={{flex: 0}}>
    <List style={{ elevation: 3, backgroundColor: 'white' }}>
      <ListItem header itemDivider>
        <Left>
          <Text>{title}</Text>
        </Left>
      </ListItem>
      {acquirements.length === 0 && (
        <ListItem>
          <Body style={styles.stretch}>
            <Text note>データが足りないようです</Text>
          </Body>
        </ListItem>
      )}
      {acquirements.map(it => (
        <ListItem key={it.id}>
          <Body>
            <Text note>{it.name}</Text>
          </Body>
        </ListItem>
      ))}
    </List>
  </Card>
)
