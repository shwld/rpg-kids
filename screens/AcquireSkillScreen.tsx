import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import { Content } from 'native-base'
import { compose } from 'react-apollo'
import getParam from '../lib/utils/getParam'
import AcquirementForm, { State as formData } from '../components/AcquirementForm'
import { Graphql, MutateCallbacks } from '../graphql/screens/AcquireSkill'
import { trackEvent } from '../lib/analytics'

interface Props {
  characterId: string
  navigation: NavigationScreenProp<any, any>
  acquireSkill(payload: { variables: {characterId: string, name: string, acquiredAt: Date}, refetchQueries: any, update: any })
}


const save = async (props: Props, data: formData) => {
  trackEvent('AcquireSkill: save')
  const { navigation, acquireSkill } = props
  const characterId = getParam({navigation}, 'characterId')
  const { name, acquiredAt } = data
  await acquireSkill({
    variables: {
      characterId,
      name: name.value,
      acquiredAt: acquiredAt.value,
    },
    ...MutateCallbacks.AcquireSkill(characterId),
  })
  navigation.pop()
}

export default compose(
  Graphql.AcquireSkill(),
)((props: Props) => (
  <Content>
    <AcquirementForm save={(data: formData) => save(props, data)} />
  </Content>
))
