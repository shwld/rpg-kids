import SEXES from '../constants/sexes'

export default (value?: string) => {
  if (!value) { return '不明' }
  const sex = SEXES.find(s => s.value === value)
  return sex ? sex.label : '不明'
}
