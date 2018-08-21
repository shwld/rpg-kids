import { AsyncStorage } from 'react-native'
import gql from 'graphql-tag'

const getSelectedCharacterIdFromStorage = async (newValue: string) => {
  if (newValue) { return newValue }
  let selectedCharacterId = ''
  try {
    const value = await AsyncStorage.getItem('rpg:selectedCharacterId')
    if (value !== null) {
      selectedCharacterId = value
    }
  } catch (e) {
    console.error(e)
  }
  return selectedCharacterId
}

export default {
  state: async (_obj, _args, { cache }: { cache }) => {
    const query = gql`
      query getState @client {
        state {
          selectedCharacterId
        }
      }
    `
    const data = cache.readQuery({ query })
    data.state.selectedCharacterId = await getSelectedCharacterIdFromStorage(data.state.selectedCharacterId)

    return data.state
  },
}
