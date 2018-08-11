import React from 'react';
import { Font, AppLoading } from 'expo'
import { Ionicons } from '@expo/vector-icons'
import AuthSwitch from './navigator/AuthSwitch'
import { Root } from 'native-base'
import OverlayIndicator from './components/OverlayIndicator'

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
        <OverlayIndicator />
        <Root>
          <AuthSwitch />
        </Root>
      </Apollo>
    )
  }

  async componentWillMount() {
    await Font.loadAsync({
      ...Ionicons.font,
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({ isLoading: false });
  }
}

export default App
