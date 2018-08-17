import React from 'react'
import { createStackNavigator } from 'react-navigation'
import MyStatus from '../screens/MyStatusScreen'
import Log from '../screens/LogScreen'
import AcquireSkillScreen from '../screens/AcquireSkillScreen'
import AddCharacter from '../screens/AddCharacterScreen'
import EditCharacter from '../screens/EditCharacterScreen'

export default createStackNavigator({
  MyStatus: {
    screen: MyStatus,
    navigationOptions: {
      headerTitle: '情報・記録',
    },
  },
  AddCharacter: {
    screen: AddCharacter,
    navigationOptions: {
      headerTitle: '子供を追加',
    },
  },
  EditCharacter: {
    screen: EditCharacter,
    navigationOptions: {
      headerTitle: '子供の情報を編集',
    },
  },
  Log: {
    screen: Log,
    navigationOptions: {
      headerTitle: '成長ログ',
    },
  },
  AcquireSkill: {
    screen: AcquireSkillScreen,
    navigationOptions: {
      headerTitle: 'これできた',
    },
  },
});
