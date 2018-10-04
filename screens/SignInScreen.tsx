import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import { Content } from 'native-base'
import { compose } from 'react-apollo'
import { Text } from 'native-base'
import { Graphql } from '../graphql/screens/SignIn'
import { trackEvent } from '../lib/analytics'
import EmailAndPasswordForm, { State as formData } from '../components/EmailAndPasswordForm'


interface Props {
  navigation: NavigationScreenProp<any, any>
  signInWithEmailAndPassword(payload: { variables: {email: string, password: string} }): Promise<boolean>
  createUser(): { data: { signUp: { user: { id: string }} } }
}

const signIn = async (props: Props, data: formData) => {
  trackEvent('SignIn: signIn')
  const { signInWithEmailAndPassword } = props
  const { email, password } = data
  const result = await signInWithEmailAndPassword({
    variables: {
      email: email.value,
      password: password.value,
    },
  })
  return result
}

const complete = async (props: Props) => {
  const { createUser, navigation } = props
  await createUser()
  navigation.navigate('App')
}

export default compose(
  Graphql.SignInWithEmailAndPassword(),
  Graphql.CreateUser(),
)(props => (
  <Content>
    <Text style={{marginTop: 100, marginBottom: 20, textAlign: 'center'}}>ログインする</Text>
    <EmailAndPasswordForm
      submit={(data: formData) => signIn(props, data)}
      handleSubmitComplate={() => complete(props)}
    />
    <Text
      note
      style={{marginTop: 50, textAlign: 'center'}}
      onPress={() => props.navigation.navigate('WalkThrough')}
    >戻る</Text>
  </Content>
))
