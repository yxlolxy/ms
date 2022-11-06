import routes from '../router/routes'

let routePathsCache = null

const getRouteCache = () => {
  // 按照num缓存所有路由信息
  if (!routePathsCache) {
    const arr = [...routes.children]
    let result = {}
    for (let i = 0; i < arr.length; i++) {
      const tmp = arr[i]
      if (!result[tmp.name]) {
        result[tmp.name] = {
          name: tmp.name,
          path: tmp.path,
          title: tmp.meta?.title,
          icon: tmp.meta?.icon,
        }
      }
      if (tmp.children?.length) {
        tmp.children.forEach((child) => {
          result[child.name] = {
            name: child.name,
            path: child.path,
            title: child.meta?.title,
            icon: child.meta?.icon,
            parent: tmp.name,
          }
        })
        arr.push(...tmp.children)
      }
    }
    if (Object.keys(result).length) {
      routePathsCache = result
    }
  }
  return routePathsCache
}

export const getRouteByCache = (routeName) => {
  const cache = getRouteCache()
  return cache[routeName]
}

export const getRoutePath = (routeName) => {
  //  获取路由路径
  const cache = getRouteCache()
  const name = routeName
  let path = []
  let parent = cache[name]
  while (parent) {
    path.unshift(parent.title)
    parent = cache[parent.parent]
  }
  return path
}
