import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import Container from '../components/Container'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import {
  Text,
  Button,
} from 'native-base'

interface Props {
  navigation: NavigationScreenProp<any, any>
  signIn: () => Promise<boolean>
  signUp: () => { data: { signUp: { user: { id: string }} } }
}
interface State {
}


const SIGNIN = gql`
  mutation SignIn {
    signIn @client
  }
`;

const SIGNUP = gql`
  mutation SignUp {
    signUp @client {
      user {
        id
      }
    }
  }
`;

class Screen extends React.Component<Props, State> {
  render() {
    return (
      <Container>
        <Button block onPress={async () => {
          await this.props.signIn();
          await this.props.signUp();
          this.props.navigation.navigate('App')
        }}><Text>始める</Text></Button>
      </Container>
    );
  }
}

export default compose(
  graphql(SIGNIN, { name: 'signIn'}),
  graphql(SIGNUP, { name: 'signUp'}),
)(Screen)
