import config from '../../config'
import { Redis } from 'ioredis'
import { Res } from '../../src/types/http.type'
import { v4 } from 'uuid'

let token: string = null

/**
 *获取token加密密钥
 * @returns
 */
export const getTokenSecret = () => {
  if (!token) token = v4()
  return token
}

/**
 * 接口相应工具函数
 */
export const response = {
  success<T = any>(data: T): Res<T> {
    return {
      data,
    }
  },
  fail(error: string): Res<void> {
    return {
      error,
    }
  },
}
/**
 * 判断是否接口请求
 * @param url 请求url
 * @returns
 */
export const isApiRequest = (url: string) => {
  const reg = new RegExp(`/${config.apiPrefix}/?[^.]*$`)
  return reg.test(url)
}

/**
 * 判断是否为待校验的api
 * @param url 请求url
 * @returns
 */
export const isTokenApi = (url: string) => {
  if (!isApiRequest(url)) return false
  const whiteList = config.apiNoTokenList
  let str = ''
  whiteList.forEach((s, index) => {
    if (index) {
      str += '|'
    }
    str += `(${s})`
  })
  const reg = new RegExp(`/${str}/?[^.]*$`)
  return !reg.test(url)
}

let redisClient: Redis
/**
 * 设置redis客户端对象
 * @param client redis客户端对象
 */
export const setRedisClient = (client) => {
  redisClient = client
}

/**
 * 获取redis客户端对象
 * @returns redis客户端对象
 */
export const getRedisClient = () => {
  return redisClient
}
