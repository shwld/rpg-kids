import React from 'react';
import { createStackNavigator } from 'react-navigation';
import FlowScreen from '../screens/FlowScreen';
import SkillScreen from '../screens/SkillScreen';

export default createStackNavigator({
  Flow: {
    screen: FlowScreen,
    navigationOptions: {
      headerTitle: 'みんなの成長',
    },
  },
  Skill: {
    screen: SkillScreen,
    navigationOptions: {
      headerTitle: '自分を中心にして回転できた',
    },
  },
});
