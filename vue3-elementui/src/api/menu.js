import axios from './axios'

/**
 * 获取菜单列表
 * @returns list
 */
export const getMenus = () => {
  return axios.request({
    url: '/permission/getAllPermissions',
    method: 'get',
  })
}

/**
 * 新增菜单
 * @param {} data {pId, name, title, isPage}
 * @returns true
 */
 export const addMenu = (data) => {
  return axios.request({
    url: '/permission/addPermission',
    method: 'post',
    data,
  })
}

/**
 * 更新菜单
 * @param {*} data {id, pId, name, title, isPage}
 * @returns true
 */
export const uptMenu = (data) => {
  return axios.request({
    url: '/permission/uptPermission',
    method: 'post',
    data,
  })
}

/**
 * 删除菜单
 * @param {*} id 菜单ID
 * @returns true
 */
export const delMenu = (id) => {
  return axios.request({
    url: `/permission/delPermission/${id}`,
    method: 'delete',
  })
}
