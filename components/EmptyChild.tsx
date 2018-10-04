import React from 'react'
import {
  Text,
  Body,
  Button,
} from 'native-base'
import { NavigationScreenProp } from 'react-navigation'


interface Props {
  navigation: NavigationScreenProp<any, any>
}

export default (props: Props) => (
  <Body style={{justifyContent: 'center', alignItems: 'stretch'}}>
    <Text note style={{textAlign: 'center'}}>まずは子供の情報を登録しよう</Text>
    <Button block onPress={() => props.navigation.navigate('AddCharacter')}>
      <Text>子供を登録する</Text>
    </Button>
  </Body>
)
