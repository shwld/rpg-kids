import React from "react"
import { WebBrowser } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import { compose } from 'react-apollo'
import { Graphql } from '../graphql/screens/WalkThrough'
import { ImageBackground, Dimensions } from 'react-native'
import { Text, Button } from 'native-base'
import { trackEvent } from '../lib/analytics'


interface Props {
  navigation: NavigationScreenProp<any, any>
  signInAnonymously: () => Promise<boolean>
  createUser: () => { data: { signUp: { user: { id: string }} } }
}

export interface State {
  inProgress: boolean
}

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

export default compose(
  Graphql.SignInAnonymously(),
  Graphql.CreateUser(),
)(class extends React.Component<Props, State> {
  state = { inProgress: false }

  async start() {
    trackEvent('WalkThrough: start')
    const { signInAnonymously, createUser, navigation } = this.props
    this.setState({inProgress: true})
    try {
      await signInAnonymously()
      await createUser()
    } finally {
      this.setState({inProgress: false})
    }
    navigation.navigate('App')
  }

  render() {
    const { navigation } = this.props
    return (
      <ImageBackground
        source={require('../assets/splash.png')}
        resizeMode='stretch'
        style={{
          flex: 1,
          width: viewportWidth,
          height: viewportHeight,
          justifyContent: 'flex-end',
          alignItems: 'center',
      }}>
        {!this.state.inProgress && <Text
          style={{marginBottom: 20}}
          onPress={() => WebBrowser.openBrowserAsync('https://shwld.net/seicho/terms-of-service/')}
        >利用規約</Text>}
        <Button
          style={{marginBottom: 20, alignSelf: 'center'}}
          disabled={this.state.inProgress}
          onPress={() => this.start()}
        >
          <Text>{this.state.inProgress ? '登録しています...' : '利用規約に同意してはじめる'}</Text>
        </Button>
        {!this.state.inProgress && <Text
          note
          style={{marginBottom: 50}}
          onPress={() => navigation.navigate('SignIn')}
        >既にアカウントをお持ちの方はこちら</Text>}
      </ImageBackground>
    )
  }
})
