import axios from './axios'

/**
 * 获取角色列表
 * @param {*} data { name }
 * @returns list
 */
export const getRoleList = (data) => {
  return axios.request({
    url: '/role/roleList',
    method: 'post',
    data,
  })
}

/**
 * 获取角色详情
 * @param {*} id 角色ID
 * @returns { id, name, permissionIds }
 */
export const getRoleDetail = (id) => {
  return axios.request({
    url: `/role/roleDetail/${id}`,
    method: 'get',
  })
}

/**
 * 新增角色
 * @param {} data {name, permissionIds}
 * @returns true
 */
export const addRole = (data) => {
  return axios.request({
    url: '/role/addRole',
    method: 'post',
    data,
  })
}

/**
 * 更新角色
 * @param {*} data {id, name, permissionIds}
 * @returns true
 */
export const uptRole = (data) => {
  return axios.request({
    url: '/role/uptRole',
    method: 'post',
    data,
  })
}

/**
 * 删除角色
 * @param {*} id 角色ID
 * @returns true
 */
export const delRole = (id) => {
  return axios.request({
    url: `/role/delRole/${id}`,
    method: 'delete',
  })
}
