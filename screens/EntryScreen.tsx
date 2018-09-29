import React from 'react'
import { NavigationScreenProp } from 'react-navigation'
import { Graphql } from '../graphql/screens/Entry'
import firebase from '../lib/firebase'
import { setUserId, trackEvent } from '../lib/analytics'
import Loading from '../components/Loading'


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
    const to = authenticate ? 'App' : 'WalkThrough'
    navigation.navigate(to)
  }

  render() {
    return <Loading />
  }

  setTrackingUserId() {
    const currentUser = firebase.auth().currentUser
    if (currentUser) {
      setUserId(currentUser.uid)
    }
  }

}

export default Graphql.Authenticate<Props>()(Entry)
