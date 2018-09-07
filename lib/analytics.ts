import { Amplitude } from 'expo'
import env from './env'

Amplitude.initialize(env.amplitudeConfig.apiKey)

export const setUserId = (userId: string) => {
  console.log(`setUserId: ${userId}`)
  Amplitude.setUserId(userId)
}

export const trackEvent = (eventName: string, properties: any = null) => {
  console.log(eventName, properties)
  if (properties) {
    return Amplitude.logEventWithProperties(eventName, properties)
  }
  return Amplitude.logEvent(eventName)
}
