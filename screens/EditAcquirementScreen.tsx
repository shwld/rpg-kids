import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import { Content } from 'native-base'
import { compose } from 'react-apollo'
import getParam from '../lib/utils/getParam'
import AcquirementForm, { State as formData } from '../components/AcquirementForm'
import isEmpty from '../lib/utils/isEmpty'
import { Component, Query, Graphql } from '../graphql/screens/EditAcquirement'
import { trackEvent } from '../lib/analytics'
import Loading from '../components/Loading'
import Error from '../components/Error'


interface Props {
  characterId: string
  navigation: NavigationScreenProp<any, any>
  editAcquirement(payload: { variables: {id: string, characterId: string, name: string, acquiredAt: Date} })
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
      {({data, loading, error}) => {
        if (error || !data) {
          return <Error navigation={props.navigation} />
        }
        if (isEmpty(data) || loading) {
          return <Loading />
        }
        return (
          <AcquirementForm
            save={(data: formData) => save(props, data)}
            handleSaveComplate={() => props.navigation.popToTop()}
            defaultValues={data.character.acquirement}
          />
        )
      }}
    </Component.GetAcquirement>
  </Content>
)

export default compose(
  Graphql.EditAcquirement(),
)(Screen)
