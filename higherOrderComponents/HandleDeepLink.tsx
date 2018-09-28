import React from 'react'
import { Linking } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import { trackEvent } from '../lib/analytics'

interface Props {
  navigation: NavigationScreenProp<any, any>
}

export default Screen => class extends React.Component<Props> {
  async componentWillMount() {
    const initialUrl = await Linking.getInitialURL()
    if (initialUrl !== Linking.makeUrl('')) {
      const { path, queryParams } = Linking.parse(initialUrl)
      trackEvent('InitialUrl has params', {path, queryParams})
      switch (path) {
        case ('invitation/accept'):
          this.props.navigation.navigate('AcceptInvitation', queryParams)
          return
      }
    }
  }

  componentDidMount() {
    Linking.addEventListener('url', e => this.handleUrl(e.url))
  }

  render() {
    return <Screen {...this.props} />
  }

  handleUrl(url: string) {
    const { navigation } = this.props
    const { path, queryParams } = Linking.parse(url)
    trackEvent('DeepLinked', {path, queryParams})
    switch (path) {
      case ('invitation/accept'):
        navigation.navigate('AcceptInvitation', queryParams)
        break
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', e => this.handleUrl(e.url))
  }
}