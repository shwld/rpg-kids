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
import Loading from '../components/Loading'
import Error from '../components/Error'


interface Props {
  navigation: NavigationScreenProp<any, any>
  signInAnonymously: () => Promise<boolean>
  createUser: () => { data: { signUp: { user: { id: string }} } }
  acceptInvititation(payload: { variables: {id: string}})
  selectCharacter(payload: { variables: {characterId: string}})
}

interface State {
  inProgress: boolean
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
  if (result.data.acceptInvitation.errors.length === 0 && result.data.acceptInvitation.invitation) {
    await selectCharacter({variables: {characterId: result.data.acceptInvitation.invitation.characterId}})
    Toast.show({
      text: '承認しました',
      buttonText: 'OK',
      duration: 3000,
      position: 'top',
      type: 'success',
    })
  } else {
    Toast.show({
      text: result.data.acceptInvitation.errors[0],
      buttonText: 'OK',
      duration: 3000,
      position: 'top',
      type: 'warning',
    })
  }
  navigation.navigate('MyStatus')
}

class Screen extends React.Component<Props, State> {
  state: State = {
    inProgress: false,
  }

  render() {
    return (
      <Component.GetSignInState query={Query.GetSignInState}>
        {({data, loading, error}) => {
          if (error || !data) {
            return <Error navigation={this.props.navigation} />
          }
          if (isEmpty(data) || loading) {
            return <Loading />
          }
          const id = getParam(this.props, 'id')
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
                  disabled={this.state.inProgress}
                  style={{marginBottom: 50, alignSelf: 'center'}}
                  onPress={() => accept(this.props, id)}
                >
                  <Text>{this.state.inProgress ? '招待を承認しています...' : '招待を承認する'}</Text>
                </Button>
              </View>}
              {!data.state.user.isSignedIn && <View>
                <Text
                  style={{marginBottom: 20, alignSelf: 'center'}}
                  onPress={() => WebBrowser.openBrowserAsync('https://shwld.net/seicho/terms-of-service/')}
                >利用規約</Text>
                <Button
                  disabled={this.state.inProgress}
                  style={{marginBottom: 50, alignSelf: 'center'}}
                  onPress={() => start(this.props, id)}
                >
                  <Text>{this.state.inProgress ? 'もうすぐはじまります...' : '利用規約に同意してはじめる'}</Text>
                </Button>
              </View>}
            </ImageBackground>
          )
        }}
      </Component.GetSignInState>
    )
  }
}

export default compose(
  Graphql.SignInAnonymously(),
  Graphql.CreateUser(),
  Graphql.AcceptInvititation(),
  Graphql.SelectCharacter(),
)(Screen)
