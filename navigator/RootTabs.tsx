import React from 'react'
import { createBottomTabNavigator } from 'react-navigation'
import Flow from './FlowStacks'
import MyStatus from './StatusStacks'
import Config from './ConfigStacks'
import TabBarIcon from '../components/TabBarIcon'
import { footerStyle } from '../styles'

export default createBottomTabNavigator({
  Flow: {
    screen: Flow,
    navigationOptions: {
      tabBarLabel: 'みんなの成長',
      tabBarIcon: (elem) => (
        TabBarIcon('stats', elem)
      ),
      tabBarOptions: footerStyle,
    },
  },
  MyStatus: {
    screen: MyStatus,
    navigationOptions: {
      tabBarLabel: '情報・記録',
      tabBarIcon: (elem) => (
        TabBarIcon('happy', elem)
      ),
      tabBarOptions: footerStyle,
    },
  },
  Config: {
    screen: Config,
    navigationOptions: {
      tabBarLabel: 'オプション',
      tabBarIcon: (elem) => (
        TabBarIcon('settings', elem)
      ),
      tabBarOptions: footerStyle,
    },
  },
})
