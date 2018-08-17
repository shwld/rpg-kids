import gql from 'graphql-tag'
import { AsyncStorage } from 'react-native'

export default {
  getSelectedCharacter: async (_obj, _args, { cache }: { cache }) => {
    let selectedCharacterId = ''
    try {
      const value = await AsyncStorage.getItem('rpg:selectedCharacterId')
      if (value !== null) {
        selectedCharacterId = value
        console.log(selectedCharacterId)
        const query = gql`
          query getState @client {
            state {
              selectedCharacterId
            }
          }
        `
        const data = {
          state: {
            __typename: 'State',
            selectedCharacterId,
          }
        }
        cache.writeQuery({ query, data })
        console.log(cache)
      }
    } catch (e) {
      console.error(e)
    }
    return selectedCharacterId
  },
}
