export default (action: Function, defaultValue: any) => {
  try {
    return action()
  } catch(e) {
    return defaultValue
  }
}
