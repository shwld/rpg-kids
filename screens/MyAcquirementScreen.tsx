import React from "react"
import { Alert } from 'react-native'
import { AppLoading } from 'expo'
import { NavigationScreenProp } from 'react-navigation'
import styles from '../styles'
import {
  Content,
  Card,
  CardItem,
  Body,
  Button,
  Text,
  View,
  Toast,
} from 'native-base'
import { compose } from 'react-apollo'
import getParam from '../lib/utils/getParam'
import isEmpty from '../lib/utils/isEmpty'
import { Component, Query, Graphql, MutateCallbacks } from '../graphql/screens/MyAcquirement'
import { trackEvent } from '../lib/analytics'
import AcquirementCard from '../components/AcquirementCard'


interface Props {
  characterId: string
  navigation: NavigationScreenProp<any, any>
  removeAcquirement(payload: { variables: {id: string, characterId: string}, refetchQueries: any, update: any })
}

interface State {
  inProgress: boolean
}

class Screen extends React.Component<Props> {
  state: State = {
    inProgress: false,
  }

  async remove() {
    trackEvent('MyAcquirement: remove')
    this.setState({inProgress: true})
    const { navigation, removeAcquirement } = this.props
    const characterId = getParam({navigation}, 'characterId')
    const acquirementId = getParam({navigation}, 'acquirementId')
    try {
      await removeAcquirement({
        variables: {
          id: acquirementId,
          characterId,
        },
        ...MutateCallbacks.RemoveAcquirement(characterId, acquirementId),
      })
    } finally {
      this.setState({inProgress: false})
    }
    Toast.show({
      text: '削除しました',
      buttonText: 'OK',
      duration: 3000,
      position: 'top',
    })
    navigation.popToTop()
  }

  render() {
    const { navigation } = this.props
    const characterId = getParam({navigation}, 'characterId')
    const id = getParam({navigation}, 'acquirementId')

    return  (
      <Content>
        <Component.GetAcquirement
          query={Query.GetAcquirement}
          variables={{
            id,
            characterId,
          }}
          fetchPolicy="cache-and-network"
        >
          {({data, loading}) => {
            if (isEmpty(data) || !data || loading) {
              return <AppLoading />
            }
            return (
              <View>
                <AcquirementCard
                  acquirement={data.character.acquirement}
                  character={data.character}
                  onCharacterClick={() => {}}
                  onAcquirementClick={() => {}}
                />
                <Card>
                  <CardItem>
                    <Body style={styles.stretch}>
                      <Button dark block onPress={() => navigation.navigate('EditAcquirement', { acquirementId: id, characterId})}>
                        <Text>編集</Text>
                      </Button>
                    </Body>
                  </CardItem>
                  <CardItem>
                    <Body style={styles.stretch}>
                      <Button danger block disabled={this.state.inProgress} onPress={() => {
                        Alert.alert(
                          '削除します',
                          'よろしいですか?',
                          [
                            {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                            {text: 'OK', onPress: () => this.remove()},
                          ],
                        )
                      }} >
                        <Text>{this.state.inProgress ? '削除しています...' : '削除'}</Text>
                      </Button>
                    </Body>
                  </CardItem>
                </Card>
              </View>
            )
          }}
        </Component.GetAcquirement>
      </Content>
    )
  }
}

export default compose(
  Graphql.RemoveAcquirement(),
)(Screen)
