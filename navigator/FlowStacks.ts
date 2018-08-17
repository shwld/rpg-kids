import React from 'react'
import { createStackNavigator } from 'react-navigation'
import FlowScreen from '../screens/FlowScreen'
import StatusScreen from '../screens/StatusScreen'

export default createStackNavigator({
  Flow: {
    screen: FlowScreen,
    navigationOptions: {
      headerTitle: 'みんなの成長',
    },
  },
  Status: {
    screen: StatusScreen,
    navigationOptions: {
      headerTitle: '情報'
    }
  }
})
