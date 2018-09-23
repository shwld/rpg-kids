import React from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'native-base'
import styles from '../styles'
import Lottie from './Lottie'


interface Props {
}

export default (props: Props) => (
  <View style={StyleSheet.absoluteFill} >
    <Lottie
      source={require('../assets/lottie/loading.json')}
      style={[styles.center, styles.w100]}
      size={10}
    />
  </View>
)
