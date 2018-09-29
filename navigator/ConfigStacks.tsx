import React from 'react'
import { createStackNavigator } from 'react-navigation'
import Options from '../screens/OptionsScreen'
import CreateEmailAndPasswordCreadential from '../screens/CreateEmailAndPasswordCreadentialScreen'
import { headerStyle } from '../styles'
import HandleDeepLink from '../higherOrderComponents/HandleDeepLink'


export default createStackNavigator({
  Options: {
    screen: HandleDeepLink(Options),
    navigationOptions: {
      headerTitle: '設定',
      ...headerStyle,
    },
  },
  CreateEmailAndPasswordCreadential: {
    screen: HandleDeepLink(CreateEmailAndPasswordCreadential),
    navigationOptions: {
      headerTitle: 'ユーザー情報登録',
      ...headerStyle,
    },
  },
})
