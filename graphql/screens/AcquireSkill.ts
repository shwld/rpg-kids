import SetInProgress from './shared/mutations/SetInProgress'
import AcquireSkill, { mutateCallbacks } from './shared/mutations/AcquireSkill'


export const MutateCallbacks = {
  AcquireSkill: mutateCallbacks,
}

export const Graphql = {
  AcquireSkill,
  SetInProgress,
}
