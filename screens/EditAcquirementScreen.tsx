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
import { Component, Query, Graphql, Getter } from '../graphql/screens/EditAcquirement'
import { Query as FlowQuery } from '../graphql/screens/Flow'
import { trackEvent } from '../lib/analytics'


interface Props {
  characterId: string
  navigation: NavigationScreenProp<any, any>
  editAcquirement(payload: { variables: {id: string, characterId: string, name: string, acquiredAt: Date} })
  removeAcquirement(payload: { variables: {id: string, characterId: string}, refetchQueries: any, update: any })
  setInProgress(payload: { variables: {inProgress: boolean}})
}

const save = async (props: Props, data: formData) => {
  trackEvent('EditAcquirement: save')
  const { navigation, editAcquirement, setInProgress } = props
  const characterId = getParam({navigation}, 'characterId')
  const acquirementId = getParam({navigation}, 'acquirementId')
  setInProgress({variables: { inProgress: true }})
  try {
    const { name, acquiredAt } = data
    await editAcquirement({
      variables: {
        id: acquirementId,
        characterId,
        name: name.value,
        acquiredAt: acquiredAt.value,
      },
    })
    navigation.replace('MyStatus')
  } catch (e) {
    throw e
  } finally {
    setInProgress({variables: { inProgress: false }})
  }
}

const remove = async (props: Props) => {
  trackEvent('EditAcquirement: remove')
  const { navigation, removeAcquirement, setInProgress } = props
  const characterId = getParam({navigation}, 'characterId')
  const acquirementId = getParam({navigation}, 'acquirementId')
  setInProgress({variables: { inProgress: true }})
  try {
    await removeAcquirement({
      variables: {
        id: acquirementId,
        characterId,
      },
      refetchQueries: [{
        query: FlowQuery.GetAcquirements,
        variables: { repoName: 'apollographql/apollo-client' },
      }],
      update: (store) => {
        let data = store.readQuery({ query: Query.GetUser })
        const character = Getter.GetCharacter(data, characterId)
        if (character) {
          let acquirementsEdges = character.acquirements.edges.filter(it => it.node.id !== acquirementId)
          character.acquirements.edges = acquirementsEdges
          store.writeQuery({ query: Query.GetUser, data })
        }
      },
    })
    navigation.replace('MyStatus')
  } catch (e) {
    throw e
  } finally {
    setInProgress({variables: { inProgress: false }})
  }
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
  Graphql.SetInProgress(),
)(Screen)
