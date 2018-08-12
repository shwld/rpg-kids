import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Status from '../screens/StatusScreen';
import Log from '../screens/LogScreen';
import AcquireSkillScreen from '../screens/AcquireSkillScreen';
import AddCharacter from '../screens/AddCharacterScreen';

export default createStackNavigator({
  Status: {
    screen: Status,
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
  Log: {
    screen: Log,
    navigationOptions: {
      headerTitle: '成長ログ',
    },
  },
  AcquireSkillScreen: {
    screen: AcquireSkillScreen,
    navigationOptions: {
      headerTitle: 'これできた',
    },
  },
});
