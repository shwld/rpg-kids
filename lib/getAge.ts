import isAfter from 'date-fns/is_after'
import differenceInDays from 'date-fns/difference_in_days'
import subYears from 'date-fns/sub_years'
import differenceInMonths from 'date-fns/difference_in_months'
import subMonths from 'date-fns/sub_months'
import differenceInYears from 'date-fns/difference_in_years'

export default function getAge(birthday: Date|string, baseDay: Date|string = new Date()) {
  const baseDate = new Date(baseDay)
  const birthDate = new Date(birthday)
  if (!birthDate || !baseDate || !isAfter(baseDate, birthDate)) { return 'はやく生まれて！' }
  let calcBase
  const years = differenceInYears(baseDate, birthDate)
  if (years >= 10) { return `${years}歳` }
  calcBase = subYears(baseDate, years)
  const months = differenceInMonths(calcBase, birthDate)
  calcBase = subMonths(calcBase, months)
  const days = differenceInDays(calcBase, birthDate)
  return `${years}歳${months}ヶ月${days}日`
}
