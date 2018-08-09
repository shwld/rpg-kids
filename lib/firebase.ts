import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = require('../firebase-credentials.json')

firebase.initializeApp(firebaseConfig)

export const authenticate = () => {
  return new Promise<boolean>(resolve => {
    firebase.auth().onAuthStateChanged(user =>
      resolve(user !== null)
    )
  })
}

export default firebase
