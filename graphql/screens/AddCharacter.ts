import { Query as MyStatusQuery } from './MyStatus'
import SetInProgress from './shared/mutations/SetInProgress'
import SelectCharacter from './shared/mutations/SelectCharacter'
import EditCharacter from './shared/mutations/EditCharacter'
import AddCharacter from './shared/mutations/AddCharacter'


export const Query = {
  GetUser: MyStatusQuery.GetUser,
}

export const Graphql = {
  AddCharacter,
  EditCharacter,
  SetInProgress,
  SelectCharacter,
}
