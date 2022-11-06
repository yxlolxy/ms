import axios from './axios'

/**
 * 获取验证码
 * @param {*} key 上一个验证码的key
 * @returns {
 *   key 检验码的key,登陆需要传
 *   img 检验码svg字符串
 * }
 */
export const getValidateCode = (key) => {
  return axios.request({
    url: key ? `/getValidateCode?key=${key}` : '/getValidateCode',
    method: 'get',
  })
}

/**
 * 登录
 * @param {*} data {
 *    username 用户名
 *    password 密码
 *    validateCodeKey 验证码key
 *    validateCode 验证码
 * }
 * @returns {
 *    user { 用户信息
 *       id
 *       username
 *    }
 *    token
 *    permissions [ 用户权限
 *       id
 *       name 对应路由名和菜单英文描述
 *       title 菜单名或按钮名
 *       isPage 是否页面内权限
 *    ]
 * }
 */
export const login = (data) => {
  return axios.request({
    url: '/login',
    method: 'post',
    data,
  })
}
