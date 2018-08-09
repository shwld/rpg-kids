import React from 'react';
import {
  Body,
  Text,
  Card,
  CardItem,
  Left,
  Right,
  Thumbnail,
  Button,
  Icon,
  View,
} from "native-base";

interface Props {
  id: string
  imageUrl: string
  name: string
  age: string
  postedAt: string
  skill: string
  onClick: Function
}

export default (props: Props) => (
  <Card>
    <CardItem>
      <Left>
        <Thumbnail source={{uri: props.imageUrl}} />
        <Body>
          <Text>{props.name}</Text>
          <Text note>{props.age}</Text>
        </Body>
      </Left>
      <Right>
      <Text note>{props.postedAt}</Text>
      </Right>
    </CardItem>
    <CardItem>
      <Body style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
        <Button primary rounded small onPress={() => props.onClick()}>
          <Text>{props.skill}</Text>
        </Button>
        <Text>できた！</Text>
      </Body>
    </CardItem>
    {/* <CardItem style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
      <Icon name="heart" style={{ color: '#ED4A6A' }} />
    </CardItem> */}
  </Card>
)
