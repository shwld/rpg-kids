import React from 'react'
import { AppLoading, Linking } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import { Graphql } from '../graphql/screens/Entry'
import firebase from '../lib/firebase'
import { setUserId, trackEvent } from '../lib/analytics'

interface Props {
  authenticate(): { data: { authenticate: boolean} }
  navigation: NavigationScreenProp<any, any>
  data: any
}

class Entry extends React.Component<Props> {
  async componentWillMount() {
    const { navigation } = this.props
    const { data: { authenticate } } = await this.props.authenticate()
    this.setTrackingUserId()
    trackEvent('Application launched')
    const initialUrl = await Linking.getInitialURL()
    if (initialUrl !== Linking.makeUrl()) {
      const { path, queryParams } = Linking.parse(initialUrl)
      trackEvent('InitialUrl has params', {path, queryParams})
      switch (path) {
        case ('invitation/accept'):
          navigation.navigate('AcceptInvitation', queryParams)
          return
      }
    }
    const to = authenticate ? 'App' : 'WalkThrough'
    navigation.navigate(to)
  }

  render() {
    return <AppLoading />
  }

  setTrackingUserId() {
    const currentUser = firebase.auth().currentUser
    if (currentUser) {
      setUserId(currentUser.uid)
    }
  }

}

export default Graphql.Authenticate<Props>()(Entry)
