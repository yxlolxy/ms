import axios from './axios'

/**
 * 获取用户列表
 * @param {*} data pageNum pageSize username
 * @returns [{ id, username, createTime, updateTime }]
 */
export const getUserList = (data) => {
  return axios.request({
    url: '/user/userList',
    method: 'post',
    data,
  })
}

/**
 * 获取用户详情
 * @param {*} id 用户ID
 * @returns { id, username, roleIds }
 */
 export const getUserDetail = (id) => {
  return axios.request({
    url: `/user/userDetail/${id}`,
    method: 'get',
  })
}

/**
 * 新增用户
 * @param {} data {username, roleIds}
 * @returns true
 */
export const addUser = (data) => {
  return axios.request({
    url: '/user/addUser',
    method: 'post',
    data,
  })
}

/**
 * 更新用户
 * @param {*} data {id, username, roleIds}
 * @returns true
 */
export const uptUser = (data) => {
  return axios.request({
    url: '/user/uptUser',
    method: 'post',
    data,
  })
}

/**
 * 删除用户
 * @param {*} id 用户ID
 * @returns true
 */
export const delUser = (id) => {
  return axios.request({
    url: `/user/delUser/${id}`,
    method: 'delete',
  })
}
