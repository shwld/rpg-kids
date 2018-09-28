import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import { Content } from 'native-base'
import { compose } from 'react-apollo'
import { Graphql } from '../graphql/screens/CreateEmailAndPasswordCreadential'
import { trackEvent } from '../lib/analytics'
import EmailAndPasswordForm, { State as formData } from '../components/EmailAndPasswordForm'


interface Props {
  navigation: NavigationScreenProp<any, any>
  createEmailAndPasswordCredential(payload: { variables: {email: string, password: string} }): Promise<boolean>
}

const create = async (props: Props, data: formData) => {
  trackEvent('CreateEmailAndPasswordCredential: create')
  const { createEmailAndPasswordCredential } = props
  const { email, password } = data
  const result = await createEmailAndPasswordCredential({
    variables: {
      email: email.value,
      password: password.value,
    },
  })
  return result
}

const complete = async (props: Props) => {
  const { navigation } = props
  navigation.navigate('App')
}

export default compose(
  Graphql.CreateEmailAndPasswordCredential(),
)(props => (
  <Content>
    <EmailAndPasswordForm
      submit={(data: formData) => create(props, data)}
      handleSubmitComplate={() => complete(props)}
      actionName="Emailとパスワードを登録"
    />
  </Content>
))
