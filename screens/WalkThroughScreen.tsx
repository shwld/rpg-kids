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
  setInProgress(payload: { variables: {inProgress: boolean}})
}

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

const start = async (props: Props) => {
  trackEvent('WalkThrough: start')
  const { signInAnonymously, createUser, setInProgress, navigation } = props
  setInProgress({variables: { inProgress: true }})
  try {
    await signInAnonymously()
    await createUser()
  } catch (e) {
    throw e
  } finally {
    setInProgress({variables: { inProgress: false }})
    navigation.navigate('App')
  }
}

export default compose(
  Graphql.SignInAnonymously(),
  Graphql.CreateUser(),
  Graphql.SetInProgress(),
)(props => (
  <ImageBackground
    source={require('../assets/splash.png')}
    resizeMode='stretch'
    style={{
      flex: 1,
      width: viewportWidth,
      height: viewportHeight,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
  }}>
    <Text
      style={{alignSelf: 'center', marginBottom: 20}}
      onPress={() => WebBrowser.openBrowserAsync('https://shwld.net/seicho/terms-of-service/')}
    >利用規約</Text>
    <Button
      style={{alignSelf: 'center', marginBottom: 50}}
      onPress={() => start(props)}
    >
      <Text>利用規約に同意してはじめる</Text>
    </Button>
  </ImageBackground>
))
