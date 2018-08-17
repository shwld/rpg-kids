import { Permissions } from 'expo'

export default async (type) => {
  await Permissions.askAsync(type)
  const { status } = await Permissions.getAsync(type)
  return status === 'granted'
}
