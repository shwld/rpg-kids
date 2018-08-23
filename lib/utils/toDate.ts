export default (value: string|Date): Date => {
  if (value instanceof Date) {
    return value
  }
  return value ? new Date(value) : new Date()
}
