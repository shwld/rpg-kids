import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Status from '../screens/StatusScreen';
import Log from '../screens/LogScreen';
import Skill from '../screens/SkillScreen';
import AddSkill from '../screens/AddSkillScreen';
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
  Skill: {
    screen: Skill,
    navigationOptions: {
      headerTitle: '自分を中心にして回転',
    },
  },
  AddSkill: {
    screen: AddSkill,
    navigationOptions: {
      headerTitle: 'これできた',
    },
  },
});
