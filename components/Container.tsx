import React from "react"
import { View } from 'native-base'
import { StyleSheet } from 'react-native'

export default (props: {children: any}) => (
  <View style={styles.container}>
    {props.children}
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

