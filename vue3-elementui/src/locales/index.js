import { createI18n } from 'vue-i18n'
import el_zh from 'element-plus/es/locale/lang/zh-cn'
import el_en from 'element-plus/es/locale/lang/en'
import zh from './zh'
import en from './en'

export const getElementLanguage = () => {
  if (navigator.language.startsWith('zh')) {
    //根据客户端决定显示语言
    return el_zh
  } else {
    return el_en
  }
}

const messages = {
  zh,
  en,
}

const i18n = createI18n({
  legacy: false, // 组合api使用
  locale: navigator.language.startsWith('zh') ? 'zh' : 'en', //根据客户端决定显示语言
  messages,
})

export default i18n
