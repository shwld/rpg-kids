import React from "react"
import { AppLoading } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import { compose } from 'react-apollo'
import { Graphql } from '../graphql/screens/WalkThrough'

interface Props {
  navigation: NavigationScreenProp<any, any>
  signIn: () => Promise<boolean>
  signUp: () => { data: { signUp: { user: { id: string }} } }
}

class Screen extends React.Component<Props> {
  async componentDidMount() {
    const { signIn, signUp, navigation } = this.props
    await signIn()
    await signUp()
    navigation.navigate('App')
  }

  render() {
    return <AppLoading />
  }
}
export default compose(
  Graphql.SignIn(),
  Graphql.SignUp(),
)(Screen)
