import React from "react";
import UserCard from '../components/UserCard'
import {
  Content,
  Text,
  Form,
  Item,
  Label,
  Input,
} from "native-base";
export default () => (
  <Content>
    <Form>
      <Item floatingLabel>
        <Label>Username</Label>
        <Input />
      </Item>
      <Item floatingLabel last>
        <Label>Password</Label>
        <Input />
      </Item>
    </Form>
  </Content>
)
