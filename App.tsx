import React from 'react'
import { StatusBar } from 'react-native'
import { Font, AppLoading } from 'expo'
import { Ionicons } from '@expo/vector-icons'
import AuthSwitch from './navigator/AuthSwitch'
import { StyleProvider, Root } from 'native-base'
import getTheme from './native-base-theme/components'
import platform from './native-base-theme/variables/platform'
import OverlayIndicator from './containers/OverlayIndicator'
import './lib/sentry'

import Apollo  from './graphql/Apollo'

class App extends React.Component {
  state = {
    isLoading: true,
  }

  render() {
    if (this.state.isLoading) {
      return <AppLoading />
    }
    return (
      <Apollo>
        <StatusBar barStyle="dark-content" />
        <OverlayIndicator />
        <StyleProvider style={getTheme(platform)}>
          <Root>
            <AuthSwitch />
          </Root>
        </StyleProvider>
      </Apollo>
    )
  }

  async componentWillMount() {
    await Font.loadAsync({
      ...Ionicons.font,
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    })
    this.setState({ isLoading: false })
  }
}

export default App
