import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  w100: {
    width: '100%',
  },
  stretch: {
    flex: 1, justifyContent: 'space-between', alignItems: 'stretch'
  },
})


export const headerStyle = {
  headerTintColor: '#5E4141',
}

export const footerStyle = {
  activeTintColor: '#FFF',
  inactiveTintColor: '#CCC',
  style: {
    backgroundColor: '#C76B63',
  },
}
