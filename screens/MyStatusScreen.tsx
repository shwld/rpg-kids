import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import {
  Content,
  Text,
  Body,
  Button,
  Toast,
} from 'native-base'
import Status from '../components/Status'
import Acquirements from '../components/Acquirements'
import { compose } from 'react-apollo'
import { Query, Component, Getter, Graphql, MutateCallbacks } from '../graphql/screens/MyStatus'
import { trackEvent } from '../lib/analytics'
import Loading from '../components/Loading'
import Error from '../components/Error'


interface Props {
  navigation: NavigationScreenProp<any, any>
  selectCharacter(payload: { variables: {characterId: string}})
  removeCharacter(payload: { variables: {id: string}, refetchQueries: any, update: any })
}

const remove = async (props: Props, characterId: string) => {
  trackEvent('EditCharacter: remove')
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

      if (!character) {
        return (
          <Body style={{justifyContent: 'center', alignItems: 'stretch'}}>
            <Text note style={{textAlign: 'center'}}>まずは子供の情報を登録しよう</Text>
            <Button block onPress={() => props.navigation.navigate('AddCharacter')}>
              <Text>子供を登録する</Text>
            </Button>
          </Body>
        )
      }

      const acquirements: any[] = character.acquirements.edges.map(it => it.node)

      return (
        <Content>
          <Status
            character={character}
            selectableCharacters={characters}
            options={{
              editCharacter: () => props.navigation.navigate('EditCharacter', {characterId: character.id}),
              removeCharacter: () => remove(props, character.id),
              invite: () => props.navigation.navigate('Invite', {character: character}),
            }}
            changeCharacter={characterId => props.selectCharacter({variables: {characterId}})}
            addCharacter={() => props.navigation.navigate('AddCharacter')}
          ></Status>
          <Acquirements
            title="最近できるようになったこと"
            birthday={character.birthday}
            acquirements={acquirements}
            goLogs={() => props.navigation.navigate('Log', { characterId: character.id })}
            goSkill={id => props.navigation.navigate('MyAcquirement', { acquirementId: id, characterId: character.id})}
          ></Acquirements>
        </Content>
      )
    }}
  </Component.GetUser>
)

export default compose(
  Graphql.RemoveCharacter(),
  Graphql.SelectCharacter(),
)(Screen)
