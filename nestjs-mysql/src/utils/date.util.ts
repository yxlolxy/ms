import * as moment from 'moment'

/**
 * 获取日期字符串
 * @param input 输入日期字符串/对象/时间戳
 * @returns 日期字符串
 */
export const getDateStr = (input?: string | Date | number) => {
  input = input || Date.now()
  return moment(input).format('YYYY-MM-DD')
}

/**
 * 获取日期时间字符串
 * @param input 输入日期时间字符串/对象/时间戳
 * @returns 日期时间字符串
 */
export const getDateTimeStr = (input?: string | Date | number) => {
  input = input || Date.now()
  return moment(input).format('YYYY-MM-DD HH:mm:ss')
}
