import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import {
  Content,
  Toast,
} from 'native-base'
import Status from '../components/Status'
import EmptyChild from '../components/EmptyChild'
import { compose } from 'react-apollo'
import { Query, Component, Getter, Graphql, MutateCallbacks } from '../graphql/screens/shared/CharacterStatus'
import { trackEvent } from '../lib/analytics'
import Loading from '../components/Loading'
import Error from '../components/Error'
import { Character, Acquirement } from '../graphql/types'


interface Props {
  render: (payload: {character: Character, characters: Character[], acquirements: Acquirement[]}) => JSX.Element
  navigation: NavigationScreenProp<any, any>
  selectCharacter(payload: { variables: {characterId: string}})
  removeCharacter(payload: { variables: {id: string}, refetchQueries: any, update: any })
  useOptions?: boolean
  canAddCharacter?: boolean
}

const remove = async (props: Props, characterId: string) => {
  trackEvent('CharacterStatus: remove')
  const { navigation, removeCharacter } = props
  await removeCharacter({
    variables: { id: characterId },
    ...MutateCallbacks.RemoveCharacter(),
  })
  Toast.show({
    text: '削除しました',
    buttonText: 'OK',
    duration: 3000,
    position: 'top',
    type: 'success',
  })
  navigation.popToTop()
}

const Screen = (props: Props) => (
  <Component.GetUser query={Query.GetUser} fetchPolicy="cache-and-network">
    {({data, loading, error}) => {
      if (error || !data) {
        return <Error navigation={props.navigation} />
      }
      if (loading) { return <Loading /> }

      const characters = data.user.characters.edges.map(it => it.node)
      const character = Getter.getCurrentCharacter(data)

      if (!character) { return <EmptyChild navigation={props.navigation} /> }
      const acquirements: any[] = character.acquirements.edges.map(it => it.node)

      const options = props.useOptions !== false ? {
        editCharacter: () => props.navigation.navigate('EditCharacter', {characterId: character.id}),
        removeCharacter: () => remove(props, character.id),
        invite: () => props.navigation.navigate('Invite', {character: character}),
      } : undefined

      return (
        <Content>
          <Status
            character={character}
            selectableCharacters={characters}
            options={options}
            canAddCharacter={props.canAddCharacter !== false}
            changeCharacter={characterId => props.selectCharacter({variables: {characterId}})}
            addCharacter={() => props.navigation.navigate('AddCharacter')}
          ></Status>
          {props.render({character, characters, acquirements})}
        </Content>
      )
    }}
  </Component.GetUser>
)

export default compose(
  Graphql.RemoveCharacter(),
  Graphql.SelectCharacter(),
)(Screen)
