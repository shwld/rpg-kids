import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import {
  Content,
  List,
  ListItem,
  Text,
  View,
  Button,
} from 'native-base'
import { Component, Query } from '../graphql/screens/Options'
import Loading from '../components/Loading'
import Error from '../components/Error'
import Lottie from '../components/Lottie'
import styles from '../styles'
import theme from '../native-base-theme/variables/platform'


interface Props {
  navigation: NavigationScreenProp<any, any>
}

export default (props: Props) => (
  <Component.GetUserState
    query={Query.GetUserState}
  >
    {({data, loading, error}) => {
      if (error || !data) {
        return <Error navigation={props.navigation} />
      }
      if (loading) { return <Loading /> }

      const state = data.state
      const { hasEmail, email } = state.user

      return (
        <Content style={{backgroundColor: 'white'}}>
          <List>
            <ListItem itemDivider>
              <Text>ユーザーについて</Text>
            </ListItem>
            {hasEmail && <ListItem>
              <View style={styles.inline}>
                <Lottie source={require('../assets/lottie/check_animation.json')} size={theme.noteFontSize} />
                <Text note style={{marginLeft: 10, fontSize: theme.noteFontSize}}>メールアドレス: {email}</Text>
              </View>
            </ListItem>}
            {!hasEmail && <ListItem style={{flexDirection: 'column', alignItems: 'flex-start'}}>
              <Button block onPress={() => props.navigation.navigate('CreateEmailAndPasswordCreadential')}>
                <Text>メールアドレスとパスワードを登録する</Text>
              </Button>
              <Text note>違う端末からでも同じデータを利用できるようになります</Text>
            </ListItem>}
          </List>
        </Content>
      )
    }}
  </Component.GetUserState>
)
