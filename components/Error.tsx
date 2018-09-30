import React from 'react'
import { StyleSheet } from 'react-native'
import { View, Button, Text } from 'native-base'
import styles from '../styles'
import Lottie from './Lottie'
import { NavigationScreenProp } from 'react-navigation'


interface Props {
  navigation: NavigationScreenProp<any, any>
  beforeAction?: () => Promise<Function>
}

export default ({beforeAction, navigation}: Props) => (
  <View style={StyleSheet.absoluteFill} >
    <Lottie
      source={require('../assets/lottie/trashbox.json')}
      style={[styles.center, styles.w100]}
    />
    <Text note style={{textAlign: 'center'}}>申し訳ありません。何か問題が起こったようです。</Text>
    <Button
      block
      onPress={async () => {
        if (beforeAction) { await beforeAction() }
        navigation.navigate('App')
      }}
      style={{margin: 30}}
    >
      <Text>トップに戻る</Text>
    </Button>
  </View>
)
