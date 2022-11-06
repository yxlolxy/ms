import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/index.less'
import i18n, { getElementLanguage } from './locales'
import router from './router'
import { useAppStore } from './store/app'
import api from './api'

const app = createApp(App)
app
  .use(i18n)
  .use(createPinia())
  .use(router)
  .use(ElementPlus, {
    locale: getElementLanguage(window.navigator.language),
  })
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$authorize = (routeName, name) => {
  const { validaPageAccess } = useAppStore()
  return validaPageAccess(routeName, name)
}
app.config.globalProperties.$api = api

app.mount('#app')
