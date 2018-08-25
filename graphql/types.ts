export interface RelayConnection<T> {
  edges: Array<{
    node: T
  }>
  pageInfo: {
    hasNextPage: boolean
    endCursor: string|null
  }
}

export interface User {
  id: string
  createdAt: Date
  characters: RelayConnection<Character>
}

export interface Character {
  id: string
  name: string
  birthday: Date
  description?: string
  imageUrl?: string
  acquirements: RelayConnection<Acquirement>
  acquirement: Acquirement
}

export interface Acquirement {
  id: string
  name: string
  acquiredAt: Date
}

export interface State {
  inProgress: boolean
  selectedCharacterId: string
  user: UserState
}

export interface UserState {
  isSignedIn: false
}
