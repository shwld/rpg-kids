import { Constants } from 'expo'

const ENV = {
  staging: {
    graphqlUrl: 'https://role-playing-g-staging.herokuapp.com/graphql',
    firebaseConfig: require('../firebase-credentials-staging.json'),
  },
  prod: {
    graphqlUrl: 'https://role-playing-g.herokuapp.com/graphql',
    firebaseConfig: require('../firebase-credentials.json'),
  }
}

const getEnvVars = (env = '') => {
  if (env) {
    if (env.indexOf('staging') !== -1) return ENV.staging
    if (env.indexOf('prod') !== -1) return ENV.prod
  }
  return ENV.staging
}


export default getEnvVars(Constants.manifest.releaseChannel)
