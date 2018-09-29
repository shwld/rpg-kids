import React from 'react'
import { createStackNavigator } from 'react-navigation'
import AcquireSkill from '../screens/AcquireSkillScreen'
import { headerStyle } from '../styles'
import HandleDeepLink from '../higherOrderComponents/HandleDeepLink'


export default createStackNavigator({
  AcquireSkill: {
    screen: HandleDeepLink(AcquireSkill),
    navigationOptions: {
      headerTitle: 'できたことを記録',
      ...headerStyle,
    },
  },
})
