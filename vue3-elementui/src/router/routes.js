import i18n from '../locales'

const { t } = i18n.global

const route = {
  path: '/',
  name: 'main',
  component: () => import('../layout/index.vue'),
  redirect: 'index',
  children: [
    {
      path: '/system',
      name: 'system',
      meta: {
        title: t('menus.system'),
        icon: 'Odometer',
      },
      component: () => import('../layout/router-view.vue'),
      redirect: 'user',
      children: [
        {
          path: '/user',
          name: 'user',
          meta: {
            title: t('menus.system_user'),
          },
          component: () => import('../views/system/user/index.vue'),
        },
        {
          path: '/role',
          name: 'role',
          meta: {
            title: t('menus.system_role'),
          },
          component: () => import('../views/system/role/index.vue'),
        },
        {
          path: '/menu',
          name: 'menu',
          meta: {
            title: t('menus.sytem_menu'),
          },
          component: () => import('../views/system/menu/index.vue'),
        },
      ],
    },
    {
      path: '/index',
      name: 'index',
      meta: {
        title: t('menus.index'),
      },
      component: () => import('../views/index.vue'),
    },
  ],
}

export default route
