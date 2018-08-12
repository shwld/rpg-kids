import React from 'react';
import { createStackNavigator } from 'react-navigation';
import FlowScreen from '../screens/FlowScreen';

export default createStackNavigator({
  Flow: {
    screen: FlowScreen,
    navigationOptions: {
      headerTitle: 'みんなの成長',
    },
  },
});
