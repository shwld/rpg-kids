import { StyleSheet } from 'react-native'
import theme from '../native-base-theme/variables/platform'


export default StyleSheet.create({
  w100: {
    width: '100%',
  },
  stretch: {
    flex: 1, justifyContent: 'space-between', alignItems: 'stretch'
  },
  inline: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
})


export const headerStyle = {
  headerTintColor: theme.titleFontColor,
}

export const footerStyle = {
  activeTintColor: theme.tabBarActiveTextColor,
  inactiveTintColor: theme.tabBarTextColor,
  style: {
    backgroundColor: theme.footerDefaultBg,
  },
}
