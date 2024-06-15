import { format as formatFn, parse as parseFn } from 'date-fns'

export class Time {
  static async format(date: Date | number, formatStr: string) {
    return formatFn(date, formatStr)
  }

  static async parse(dateStr: string, formatStr: string, referenceDate: string | number | Date) {
    return parseFn(dateStr, formatStr, referenceDate)
  }
}