import React from "react"
import { Linking } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import {
  Text,
  Card,
  CardItem,
  Content,
  Button,
  Icon,
} from 'native-base'
import getParam from '../lib/utils/getParam'
import { Graphql } from '../graphql/screens/Invite'
import { trackEvent } from '../lib/analytics'
import env from '../lib/env'
import { Character } from '../graphql/types'
import styles from '../styles'


interface Props {
  characterId: string
  navigation: NavigationScreenProp<any, any>
  invite(payload: { variables: {characterId: string} })
  setInProgress(payload: { variables: {inProgress: boolean}})
}

export default Graphql.Invite<Props>()(
  class extends React.Component<Props, {url: string, character: any}> {
    state = {
      url: '',
      character: { name: '' },
    }
    async componentWillMount() {
      const { invite, navigation } = this.props
      const character: Character = getParam({navigation}, 'character')
      const result = await invite({ variables: { characterId: character.id }})
      if (!result.data.invite.invitation) { return }
      const invitationId = result.data.invite.invitation.id
      const url = `${env.invitationUrl}/${invitationId}`
      this.setState({url, character})
    }

    makeInvitationText(prefix: string, name: string) {
      const body = `
[${name}]の親御さんへ

[みんなの成長]に招待されました

こちらのURLからはじめてください

${this.state.url}
      `
      return `${prefix}${encodeURIComponent(body)}`
    }

    async open(url: string) {
      const can = await Linking.canOpenURL(url)
      if (!can) { return }
      Linking.openURL(url)
    }

    render() {
      const name = this.state.character ? this.state.character.name : ''
      return (
        <Content>
          <Card style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <CardItem>
              <Text>「{name}」の親を招待する</Text>
            </CardItem>
            <CardItem>
              <Text note>招待することで、{name}の成長を一緒に登録することができます</Text>
            </CardItem>
            <CardItem>
              <Button block primary style={styles.w100}>
                <Icon name="ios-chatbubbles" />
                <Text onPress={() => {
                  trackEvent('Invite: sms')
                  this.open(this.makeInvitationText('sms:&body=', name))
                }}>SMSで招待する</Text>
              </Button>
            </CardItem>
            <CardItem>
              <Button block primary style={styles.w100}>
                <Icon name="ios-mail" />
                <Text onPress={() => {
                  trackEvent('Invite: mailto')
                  this.open(this.makeInvitationText('mailto:?body=', name))
                }}>メールで招待する</Text>
              </Button>
            </CardItem>
          </Card>
        </Content>
      )
    }
  }
)
