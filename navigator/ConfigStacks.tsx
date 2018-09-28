import React from 'react'
import { createStackNavigator } from 'react-navigation'
import CreateEmailAndPasswordCreadential from '../screens/CreateEmailAndPasswordCreadentialScreen'
import { headerStyle } from '../styles'
import HandleDeepLink from '../higherOrderComponents/HandleDeepLink'


export default createStackNavigator({
  SignIn: {
    screen: HandleDeepLink(CreateEmailAndPasswordCreadential),
    navigationOptions: {
      headerTitle: 'ユーザー情報登録',
      ...headerStyle,
    },
  },
})
