import { format } from 'date-fns'

export function formatTime(timestamp: number, f: string = 'yyyy-MM-dd HH:mm:ss') {
  return format(timestamp, f)
}
