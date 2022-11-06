import { session } from './storage'

export const getAccessedMenus = (routes, accessedNames = []) => {
  const menus = routes.filter(
    (item) => accessedNames.includes(item.name) && !item.meta?.isDetail,
  )
  menus.forEach((route) => {
    delete route.component
    if (route?.children) {
      route.children = getAccessedMenus(route.children, accessedNames)
    }
  })
  return menus
}

export const getToken = () => {
  return session.get('token', false)
}

export const setToken = (token) => {
  return session.set('token', token)
}
