import { Query as MyStatusQuery } from './MyStatus'
import SelectCharacter from './shared/mutations/SelectCharacter'
import EditCharacter from './shared/mutations/EditCharacter'
import AddCharacter, { mutateCallbacks as AddCharacterMutateCallbacks } from './shared/mutations/AddCharacter'


export const Query = {
  GetUser: MyStatusQuery.GetUser,
}

export const MutateCallbacks = {
  AddCharacter: AddCharacterMutateCallbacks,
}

export const Graphql = {
  AddCharacter,
  EditCharacter,
  SelectCharacter,
}
