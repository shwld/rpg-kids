import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import Container from '../components/Container'
import { compose } from 'react-apollo'
import { Graphql } from '../graphql/screens/WalkThrough'

import {
  Text,
  Button,
} from 'native-base'

interface Props {
  navigation: NavigationScreenProp<any, any>
  signIn: () => Promise<boolean>
  signUp: () => { data: { signUp: { user: { id: string }} } }
}

export default compose(
  Graphql.SignIn(),
  Graphql.SignUp(),
)((props: Props) => (
  <Container>
    <Button block onPress={async () => {
      await props.signIn()
      await props.signUp()
      props.navigation.navigate('App')
    }}><Text>始める</Text></Button>
  </Container>
))
