import {
  Toast,
} from 'native-base'
import isIOS from './utils/isIOS'

export default class {
  private static show(message, type: 'success'|'warning') {
    const style = isIOS ? {top: '10%', zIndex: 5} : null
    Toast.show({
      text: message,
      buttonText: 'OK',
      duration: 3000,
      position: 'top',
      type,
      style,
    })
  }

  static success(message: string) {
    this.show(message, 'success')
  }

  static warning(message: string) {
    this.show(message, 'warning')
  }
}

