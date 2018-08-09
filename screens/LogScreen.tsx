import React from "react";
import {
  Content,
  Text,
  Separator,
  ListItem,
} from "native-base";
export default () => (
  <Content>
    <Separator bordered>
      <Text>0歳10ヶ月</Text>
    </Separator>
    {[...Array(10).keys()].map(i => (
      <ListItem key={i}>
        <Text>ハイハイできた</Text>
      </ListItem>
    ))}
  </Content>
)
