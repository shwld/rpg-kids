import React from 'react'
import { createBottomTabNavigator } from 'react-navigation'
import Flow from './FlowStacks'
import MyStatus from './StatusStacks'
import TabBarIcon from '../components/TabBarIcon'

export default createBottomTabNavigator({
  Flow: {
    screen: Flow,
    navigationOptions: {
      tabBarLabel: 'みんなの成長',
      tabBarIcon: (elem) => (
        TabBarIcon('stats', elem)
      ),
    },
  },
  MyStatus: {
    screen: MyStatus,
    navigationOptions: {
      tabBarLabel: '情報・記録',
      tabBarIcon: (elem) => (
        TabBarIcon('happy', elem)
      ),
      
    },
  },
})
