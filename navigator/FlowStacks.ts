import React from 'react'
import { createStackNavigator } from 'react-navigation'
import FlowScreen from '../screens/FlowScreen'
import StatusScreen from '../screens/StatusScreen'
import { headerStyle } from '../styles'

export default createStackNavigator({
  Flow: {
    screen: FlowScreen,
    navigationOptions: {
      headerTitle: 'みんなの成長',
      ...headerStyle,
    },
  },
  Status: {
    screen: StatusScreen,
    navigationOptions: {
      headerTitle: '情報',
      ...headerStyle,
    }
  }
})
