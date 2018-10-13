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
  sex?: string
  acquirements: RelayConnection<Acquirement>
  nextAcquirements: RelayConnection<Acquirement>
  acquirementsCount: number
  acquirement: Acquirement
}

export interface Acquirement {
  id: string
  name: string
  acquiredAt: Date
}

export interface State {
  selectedCharacterId: string
  user: UserState
}

export interface UserState {
  isSignedIn: boolean
  hasEmail: boolean
  email: string
}
