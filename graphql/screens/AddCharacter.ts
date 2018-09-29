import { Query as StatusQuery } from './shared/CharacterStatus'
import SelectCharacter from './shared/mutations/SelectCharacter'
import EditCharacter from './shared/mutations/EditCharacter'
import AddCharacter, { mutateCallbacks as AddCharacterMutateCallbacks } from './shared/mutations/AddCharacter'


export const Query = {
  GetUser: StatusQuery.GetUser,
}

export const MutateCallbacks = {
  AddCharacter: AddCharacterMutateCallbacks,
}

export const Graphql = {
  AddCharacter,
  EditCharacter,
  SelectCharacter,
}
