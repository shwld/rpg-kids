import React from 'react'
import { createSwitchNavigator } from 'react-navigation'
import RootTabs from './RootTabs'
import EntryScreen from '../screens/EntryScreen'
import WalkThroughScreen from '../screens/WalkThroughScreen'
import AcceptInvitationScreen from '../screens/AcceptInvitationScreen'
import SignInScreen from '../screens/SignInScreen'
import { trackEvent } from '../lib/analytics'

const getRoute = (navigationState) => {
  if (!navigationState) { return null }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getRoute(route)
  }
  return route
}

const Navigator = createSwitchNavigator(
  {
    Entry: EntryScreen,
    App: RootTabs,
    WalkThrough: WalkThroughScreen,
    AcceptInvitation: AcceptInvitationScreen,
    SignIn: SignInScreen,
  },
  {
    initialRouteName: 'Entry',
  },
)

export default () => (
  <Navigator
    onNavigationStateChange={(prevState, currentState) => {
      const currentScreen = getRoute(currentState)
      const prevScreen = getRoute(prevState)

      if (prevScreen !== currentScreen) {
        const routeName = currentScreen ? currentScreen.routeName : ''
        trackEvent(`${routeName}: visited`, currentScreen)
      }
    }}
  />
)
