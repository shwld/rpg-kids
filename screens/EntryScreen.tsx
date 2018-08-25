import React from 'react'
import { AppLoading } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import { Graphql } from '../graphql/screens/Entry'


interface Props {
  authenticate(): { data: { authenticate: boolean} }
  navigation: NavigationScreenProp<any, any>
  data: any
}

class Entry extends React.Component<Props> {
  async componentWillMount() {
    const { navigation } = this.props
    const { data: { authenticate } } = await this.props.authenticate()
    const to = authenticate ? 'App' : 'SignUp'
    navigation.navigate(to)
  }
 
  render() {
    return <AppLoading />
  }
}

export default Graphql.Authenticate<Props>()(Entry)
