import { format as formatFn, parse as parseFn } from 'date-fns'

export class Time {
  format(date: Date | number, formatStr: string) {
    return formatFn(date, formatStr)
  }

  parse(dateStr: string, formatStr: string, referenceDate: string | number | Date) {
    return parseFn(dateStr, formatStr, referenceDate)
  }
}