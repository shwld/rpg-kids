import format from 'date-fns/format'
import ja from 'date-fns/locale/ja'

export default (date: Date, formatString: string = 'MMMDo') => format(date, formatString, {locale: ja})