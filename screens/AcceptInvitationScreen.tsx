import React from "react"
import { WebBrowser, AppLoading } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import { compose } from 'react-apollo'
import { Query, Component, Graphql } from '../graphql/screens/AcceptInvitation'
import { ImageBackground, Dimensions } from 'react-native'
import { Text, Button, View, Toast } from 'native-base'
import { trackEvent } from '../lib/analytics'
import isEmpty from '../lib/utils/isEmpty'
import getParam from '../lib/utils/getParam'


interface Props {
  navigation: NavigationScreenProp<any, any>
  signInAnonymously: () => Promise<boolean>
  createUser: () => { data: { signUp: { user: { id: string }} } }
  acceptInvititation(payload: { variables: {id: string}})
  selectCharacter(payload: { variables: {characterId: string}})
}

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

const start = async (props: Props, id: string) => {
  trackEvent('InvitationAccept: start')
  const { signInAnonymously, createUser, acceptInvititation, navigation } = props
  await signInAnonymously()
  await createUser()
  await acceptInvititation({variables: {id}})
  navigation.navigate('App')
}

const accept = async (props: Props, id: string) => {
  trackEvent('InvitationAccept: accept')
  const { acceptInvititation, selectCharacter,  navigation } = props

  const result = await acceptInvititation({variables: {id}})
  if (!result.error && result.data.acceptInvitation.invitation) {
    await selectCharacter({variables: {characterId: result.data.acceptInvitation.invitation.characterId}})
  } else {
    Toast.show({
      text: '招待が見つからないか期限切れです',
      buttonText: 'OK',
      duration: 3000,
      position: 'top',
    })
  }
  navigation.navigate('MyStatus')
}

export default compose(
  Graphql.SignInAnonymously(),
  Graphql.CreateUser(),
  Graphql.AcceptInvititation(),
  Graphql.SelectCharacter(),
)(props => (
  <Component.GetSignInState query={Query.GetSignInState}>
    {({data, loading}) => {
      if (isEmpty(data) || !data || loading) {
        return <AppLoading />
      }
      const id = getParam(props, 'id')
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
          {data.state.user.isSignedIn && <View>
            <Button
              style={{marginBottom: 50, alignSelf: 'center'}}
              onPress={() => accept(props, id)}
            >
              <Text>招待を承認する</Text>
            </Button>
          </View>}
          {!data.state.user.isSignedIn && <View>
            <Text
              style={{marginBottom: 20, alignSelf: 'center'}}
              onPress={() => WebBrowser.openBrowserAsync('https://shwld.net/seicho/terms-of-service/')}
            >利用規約</Text>
            <Button
              style={{marginBottom: 50, alignSelf: 'center'}}
              onPress={() => start(props, id)}
            >
              <Text>利用規約に同意してはじめる</Text>
            </Button>
          </View>}
        </ImageBackground>
      )
    }}
  </Component.GetSignInState>
))
