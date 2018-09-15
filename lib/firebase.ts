import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import env from './env'
import formatFromDate from './utils/formatFromDate'

const firebaseConfig = env.firebaseConfig
firebase.initializeApp(firebaseConfig)

export const authenticate = () => {
  return new Promise<boolean>(resolve => {
    firebase.auth().onAuthStateChanged(user =>
      resolve(user !== null)
    )
  })
}

export const generatePublicMediaUrl = (path: string, updatedAt: Date) => {
  return `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodeURIComponent(path)}?alt=media&updated_at=${formatFromDate(updatedAt, 'YYYYMMDDHHmmss')}`
}

export const uploadToFireStorage = async (imageUri: string, path: string) => {
  const response = await fetch(imageUri)
  const blob = await response.blob()
  const metadata = {
    contentType: 'image/jpeg',
  }
  const ref = firebase.storage().ref(path)
  return ref.put(blob, metadata)
}

export const getIdToken = async () => {
  const currentUser = firebase.auth().currentUser
  if (!currentUser) { return null }
  const idToken = await currentUser.getIdToken(true)

  return idToken
}

export default firebase
