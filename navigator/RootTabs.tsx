import React from 'react'
import { createBottomTabNavigator } from 'react-navigation'
import Flow from './FlowStacks'
import MyStatus from './StatusStacks'
import AcquireSkill from './AcquireSkillStacks'
import Config from './ConfigStacks'
import TabBarIcon from '../components/TabBarIcon'
import { footerStyle } from '../styles'

export default createBottomTabNavigator({
  Flow: {
    screen: Flow,
    navigationOptions: {
      tabBarLabel: 'みんな',
      tabBarIcon: (elem) => (
        TabBarIcon('stats', elem)
      ),
      tabBarOptions: footerStyle,
    },
  },
  MyStatus: {
    screen: MyStatus,
    navigationOptions: {
      tabBarLabel: '状態',
      tabBarIcon: (elem) => (
        TabBarIcon('happy', elem)
      ),
      tabBarOptions: footerStyle,
    },
  },
  AcquireSkill: {
    screen: AcquireSkill,
    navigationOptions: {
      tabBarLabel: '記録',
      tabBarIcon: (elem) => (
        TabBarIcon('add-circle', elem)
      ),
      tabBarOptions: footerStyle,
    },
  },
  Config: {
    screen: Config,
    navigationOptions: {
      tabBarLabel: '設定',
      tabBarIcon: (elem) => (
        TabBarIcon('settings', elem)
      ),
      tabBarOptions: footerStyle,
    },
  },
})
