export default (action: Function, defaultValue: any = null) => {
  try {
    return action()
  } catch(e) {
    return defaultValue
  }
}
