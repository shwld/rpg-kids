import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import { compose } from 'react-apollo'
import { Graphql } from '../graphql/screens/AcceptInvitation'
import { ImageBackground, Dimensions } from 'react-native'
import { Text, Button, Toast } from 'native-base'
import { trackEvent } from '../lib/analytics'
import getParam from '../lib/utils/getParam'


interface Props {
  navigation: NavigationScreenProp<any, any>
  acceptInvititation(payload: { variables: {id: string}})
  selectCharacter(payload: { variables: {characterId: string}})
}

interface State {
  inProgress: boolean
}

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

const accept = async (props: Props, id: string) => {
  trackEvent('InvitationAccept: accept')
  const { acceptInvititation, selectCharacter,  navigation } = props

  const result = await acceptInvititation({variables: {id}})
  if (result.data.acceptInvitation.errors.length === 0 && result.data.acceptInvitation.invitation) {
    await selectCharacter({variables: {characterId: result.data.acceptInvitation.invitation.characterId}})
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
        <Text
          style={{marginBottom: 20}}
        >あなたは親として招待されました</Text>
        <Button
          disabled={this.state.inProgress}
          style={{marginBottom: 50, alignSelf: 'center'}}
          onPress={() => accept(this.props, id)}
        >
          <Text>{this.state.inProgress ? 'NOW LOADING...' : 'OK'}</Text>
        </Button>
      </ImageBackground>
    )
  }
}

export default compose(
  Graphql.AcceptInvititation(),
  Graphql.SelectCharacter(),
)(Screen)
