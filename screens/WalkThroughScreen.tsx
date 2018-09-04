import React from "react"
import { AppLoading } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import { compose } from 'react-apollo'
import { Graphql } from '../graphql/screens/WalkThrough'

interface Props {
  navigation: NavigationScreenProp<any, any>
  signInAnonymously: () => Promise<boolean>
  signUp: () => { data: { signUp: { user: { id: string }} } }
}

class Screen extends React.Component<Props> {
  async componentWillMount() {
    const { signInAnonymously, signUp, navigation } = this.props
    await signInAnonymously()
    await signUp()
    navigation.navigate('App')
  }

  render() {
    return <AppLoading />
  }
}
export default compose(
  Graphql.SignInAnonymously(),
  Graphql.SignUp(),
)(Screen)
