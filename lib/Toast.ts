import {
  Toast,
} from 'native-base'

export default class {
  private static show(message, type: 'success'|'warning') {
    Toast.show({
      text: message,
      buttonText: 'OK',
      duration: 3000,
      position: 'top',
      type,
      style: {top: '10%'},
    })
  }

  static success(message: string) {
    this.show(message, 'success')
  }

  static warning(message: string) {
    this.show(message, 'warning')
  }
}

