import React from "react"
import { NavigationScreenProp } from 'react-navigation'
import { compose } from 'react-apollo'
import AcquirementForm, { State as formData } from '../components/AcquirementForm'
import { Graphql, MutateCallbacks } from '../graphql/screens/AcquireSkill'
import { trackEvent } from '../lib/analytics'
import CharacterStatus from '../containers/CharacterStatus'


interface Props {
  navigation: NavigationScreenProp<any, any>
  acquireSkill(payload: { variables: {characterId: string, name: string, acquiredAt: Date}, refetchQueries: any, update: any })
}

const save = async (props: Props, data: formData, characterId: string) => {
  trackEvent('AcquireSkill: save')
  const { acquireSkill } = props
  const { name, acquiredAt } = data
  await acquireSkill({
    variables: {
      characterId,
      name: name.value,
      acquiredAt: acquiredAt.value,
    },
    ...MutateCallbacks.AcquireSkill(characterId),
  })
}

export default compose(
  Graphql.AcquireSkill(),
)((props: Props) => (
  <CharacterStatus
    navigation={props.navigation}
    render={({character}) => (
      <AcquirementForm
        save={(data: formData) => save(props, data, character.id)}
        handleSaveComplate={() => props.navigation.popToTop()}
      />
    )}
  />
))
