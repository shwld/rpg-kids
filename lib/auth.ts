import firebase from './firebase'

export const getIdToken = async () => {
  const currentUser = firebase.auth().currentUser
  if (!currentUser) { return null }
  const idToken = await currentUser.getIdToken(true)

  return idToken
}

