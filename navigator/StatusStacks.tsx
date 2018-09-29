import React from 'react'
import { createStackNavigator } from 'react-navigation'
import MyStatus from '../screens/MyStatusScreen'
import MyAcquirement from '../screens/MyAcquirementScreen'
import Log from '../screens/LogScreen'
import AddCharacter from '../screens/AddCharacterScreen'
import EditCharacter from '../screens/EditCharacterScreen'
import EditAcquirement from '../screens/EditAcquirementScreen'
import Invite from '../screens/InviteScreen'
import { headerStyle } from '../styles'
import HandleDeepLink from '../higherOrderComponents/HandleDeepLink'


export default createStackNavigator({
  MyStatus: {
    screen: HandleDeepLink(MyStatus),
    navigationOptions: {
      headerTitle: '情報・記録',
      ...headerStyle,
    },
  },
  MyAcquirement: {
    screen: HandleDeepLink(MyAcquirement),
    navigationOptions: {
      headerTitle: 'これできた',
      ...headerStyle,
    },
  },
  AddCharacter: {
    screen: HandleDeepLink(AddCharacter),
    navigationOptions: {
      headerTitle: '子供を追加',
      ...headerStyle,
    },
  },
  EditCharacter: {
    screen: HandleDeepLink(EditCharacter),
    navigationOptions: {
      headerTitle: '子供の情報を編集',
      ...headerStyle,
    },
  },
  Log: {
    screen: HandleDeepLink(Log),
    navigationOptions: {
      headerTitle: '成長ログ',
      ...headerStyle,
    },
  },
  EditAcquirement: {
    screen: HandleDeepLink(EditAcquirement),
    navigationOptions: {
      headerTitle: 'これできた を編集',
      ...headerStyle,
    },
  },
  Invite: {
    screen: HandleDeepLink(Invite),
    navigationOptions: {
      headerTitle: '親を招待する',
      ...headerStyle,
    },
  }
})
