import React from 'react';
import { AppLoading } from 'expo'
import { NavigationScreenProp } from 'react-navigation'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const AUTHENTICATE = gql`
mutation {
  authenticate @client
}
`;

interface Props {
  authenticate: () => { data: { authenticate: boolean} }
  navigation: NavigationScreenProp<any, any>
  data: any
}
interface State {
}

class Entry extends React.Component<Props, State> {
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

export default graphql<Props>(AUTHENTICATE, { name: 'authenticate'})(Entry)
