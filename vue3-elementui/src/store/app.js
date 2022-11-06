import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import { login } from '../api/app'
import i18n from '../locales'
import router, { HOMEROUTENAME } from '../router'
import route from '../router/routes'
import { getAccessedMenus } from '../utils/permission'
import { getRoutePath } from '../utils/router'
import { session } from '../utils/storage'

const { t } = i18n.global

const useAppStore = defineStore('appStore', {
  state: () => ({
    token: session.get('token'), // token
    user: session.get('user', true), //登录用户
    menus: session.get('menus', true), // 菜单
    permissions: session.get('permissions', true), // 权限
    pagePermissions: session.get('pagePermissions', true), // 页面权限
    tabsCache: session.get('tabs', true), // 删除tab页的情况下浏览器回退恢复
    tabs: session.get('tabs', true, [
      { name: HOMEROUTENAME, title: t('labels.homepage') },
    ]), // 打开的tab页需要缓存，浏览器刷新后需要还原 { name, query, params }
    excludeKeepAlive: [], // 不需要被缓存的组件，vue 3.2.34+文件名就是组件名
    curRouteName: session.get('curRouteName', false, HOMEROUTENAME), //当前路径
  }),
  getters: {
    routePathArr() {
      if (this.curRouteName === HOMEROUTENAME) {
        return []
      } else {
        return getRoutePath(this.curRouteName)
      }
    },
    validaPageAccess() {
      return (routeName, name) =>
        !!this.pagePermissions?.[routeName]?.includes(name)
    },
  },
  actions: {
    setToken(token) {
      this.token = token
      session.set('token', token)
    },
    setUser(user) {
      this.user = user
      session.set('user', user)
    },
    setTabsCache({ name, query, params }) {
      const tabsCache = [...this.tabsCache]
      const index = tabsCache.findIndex((item) => item.name === name)
      if (index === -1) {
        tabsCache.push({ name, query, params })
      } else {
        tabsCache.splice(index, 1, { name, query, params })
      }
      this.tabsCache = tabsCache
      session.set('tabsCache', tabsCache)
    },
    setCurRouteName(name) {
      this.curRouteName = name
      session.set('curRouteName', name)
    },
    setMenus(menus) {
      this.menus = menus
      session.set('menus', menus)
    },
    setPermissions(permissions) {
      this.permissions = permissions
      session.set('permissions', permissions)
    },
    setPagePermissions(pagePermissions) {
      this.pagePermissions = pagePermissions
      session.set('pagePermissions', pagePermissions)
    },
    setTabs(tabs) {
      this.tabs = tabs
      session.set('tabs', tabs)
    },
    async login(payload) {
      try {
        const res = await login(payload)
        if (res?.data) {
          const { token, user, permissions } = res.data
          if (!permissions?.length) {
            ElMessage.warning(t('messages.noPermission'))
            return false
          }
          // 菜单处理
          // 过滤出菜单权限，路由名数组
          const accessedNames = permissions
            .filter((item) => !item.isPage)
            .map((item) => item.name)
          if (!accessedNames?.length) {
            ElMessage.warning(t('messages.noPermission'))
            return false
          }
          const menus = getAccessedMenus(
            JSON.parse(JSON.stringify(route.children)),
            accessedNames,
          )
          if (!menus?.length) {
            ElMessage.warning(t('messages.noPermission'))
            return false
          }
          const permissions2 = JSON.parse(JSON.stringify(permissions))
          const accessedIdNameMap = permissions2
            .filter((item) => !item.isPage)
            .reduce((acc, cur) => {
              acc[cur.id] = cur.name
              return acc
            }, {})
          const pagePermissions = permissions2
            .filter((item) => item.isPage)
            .reduce((acc, cur) => {
              const key = accessedIdNameMap[cur.pId]
              if (!acc[key]) {
                acc[key] = [cur.name]
              } else {
                acc[key].push(cur.name)
              }
              return acc
            }, {})
          this.setPagePermissions(pagePermissions)
          this.setPermissions(permissions)
          this.setMenus(menus)
          this.setToken(token)
          this.setUser(user)
          nextTick(() => {
            router.push({
              name: HOMEROUTENAME,
            })
          })
          return true
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
})

export { useAppStore }
