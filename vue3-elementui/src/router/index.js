import NProgress from 'nprogress'
import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '../utils/permission'
import Login from '../views/login/index.vue'
import routes from './routes'
import { useAppStore } from '../store/app'
import { startProgress, endProgress } from '../utils/nprogress'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    routes,
    {
      path: '/401',
      name: 'pageNotAuth',
      component: () => import('../views/401/index.vue'),
    },
    {
      path: '/404',
      name: 'pageNotFound',
      component: () => import('../views/404/index.vue'),
    },
    {
      redirect: '/pageNotFound',
    },
  ],
})

const noTokenPageList = ['login', 'pageNotFound', 'pageNotAuth']

router.beforeEach((to, from, next) => {
  startProgress()
  if (noTokenPageList.includes(to.name)) {
    next()
    return
  }
  if (getToken()) {
    if (to.name === 'login') {
      next({
        name: 'main',
      })
    } else {
      next()
    }
  } else {
    next({
      name: 'login',
    })
  }
})
router.afterEach((to) => {
  if (noTokenPageList.includes(to.name)) {
    endProgress()
    return
  }
  // 记录路由信息
  const { name, query, params, meta } = to
  const appStore = useAppStore()
  const { tabs } = appStore
  if (!tabs.find((item) => item.name === to.name)) {
    appStore.setTabs([
      ...tabs,
      {
        name,
        title: meta.title,
        query,
        params,
      },
    ])
  }
  appStore.setCurRouteName(to.name)
  endProgress()
})

router.onError(() => {
  endProgress()
})

export const HOMEROUTENAME = 'index'

export default router
