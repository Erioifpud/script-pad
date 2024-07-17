import { format as formatFn, parse as parseFn } from 'date-fns'

export class Time {
  async format(date: Date | number, formatStr: string) {
    return formatFn(date, formatStr)
  }

  async parse(dateStr: string, formatStr: string, referenceDate: string | number | Date) {
    return parseFn(dateStr, formatStr, referenceDate)
  }
}