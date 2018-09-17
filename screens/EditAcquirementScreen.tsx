import React from "react"
import { Alert } from 'react-native'
import { AppLoading } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import styles from '../styles'
import { Content, CardItem, Body, Button, Text } from 'native-base'
import { compose } from 'react-apollo'
import getParam from '../lib/utils/getParam'
import AcquirementForm, { State as formData } from '../components/AcquirementForm'
import isEmpty from '../lib/utils/isEmpty'
import { Component, Query, Graphql, MutateCallbacks } from '../graphql/screens/EditAcquirement'
import { trackEvent } from '../lib/analytics'


interface Props {
  characterId: string
  navigation: NavigationScreenProp<any, any>
  editAcquirement(payload: { variables: {id: string, characterId: string, name: string, acquiredAt: Date} })
  removeAcquirement(payload: { variables: {id: string, characterId: string}, refetchQueries: any, update: any })
}

const save = async (props: Props, data: formData) => {
  trackEvent('EditAcquirement: save')
  const { navigation, editAcquirement } = props
  const characterId = getParam({navigation}, 'characterId')
  const acquirementId = getParam({navigation}, 'acquirementId')
  const { name, acquiredAt } = data
  await editAcquirement({
    variables: {
      id: acquirementId,
      characterId,
      name: name.value,
      acquiredAt: acquiredAt.value,
    },
  })
}

const remove = async (props: Props) => {
  trackEvent('EditAcquirement: remove')
  const { navigation, removeAcquirement } = props
  const characterId = getParam({navigation}, 'characterId')
  const acquirementId = getParam({navigation}, 'acquirementId')
  await removeAcquirement({
    variables: {
      id: acquirementId,
      characterId,
    },
    ...MutateCallbacks.RemoveAcquirement(characterId, acquirementId),
  })
}

const Screen = (props: Props) => (
  <Content>
    <Component.GetAcquirement
      query={Query.GetAcquirement}
      variables={{
        id: getParam(props, 'acquirementId'),
        characterId: getParam(props, 'characterId'),
      }}
      fetchPolicy="cache-and-network"
    >
      {({data, loading}) => {
        if (isEmpty(data) || !data || loading) {
          return <AppLoading />
        }
        return (
          <AcquirementForm
            save={(data: formData) => save(props, data)}
            handleSaveComplate={() => props.navigation.replace('MyStatus')}
            defaultValues={data.character.acquirement}
          >
            <CardItem>
              <Body style={styles.stretch}>
                <Button danger block onPress={() => {
                  Alert.alert(
                    '削除します',
                    'よろしいですか?',
                    [
                      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                      {text: 'OK', onPress: () => remove(props)},
                    ],
                  )
                }} >
                  <Text>削除</Text>
                </Button>
              </Body>
            </CardItem>
          </AcquirementForm>
        )
      }}
    </Component.GetAcquirement>
  </Content>
)

export default compose(
  Graphql.EditAcquirement(),
  Graphql.RemoveAcquirement(),
)(Screen)
