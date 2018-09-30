import React from 'react'
import { createStackNavigator } from 'react-navigation'
import FlowTabs from './FlowTabs'
import StatusScreen from '../screens/StatusScreen'
import { headerStyle } from '../styles'
import HandleDeepLink from '../higherOrderComponents/HandleDeepLink'

export default createStackNavigator({
  Flow: {
    screen: HandleDeepLink(FlowTabs),
    navigationOptions: {
      headerTitle: 'みんなの成長',
      ...headerStyle,
    },
  },
  Status: {
    screen: HandleDeepLink(StatusScreen),
    navigationOptions: {
      headerTitle: '情報',
      ...headerStyle,
    }
  }
})
