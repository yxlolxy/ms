import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from '../utils/permission'
import { session } from '../utils/storage'
import i18n from '../locales'
import { startProgress, endProgress } from '../utils/nprogress'

const { t } = i18n.global

const logout = () => {
  setTimeout(() => {
    session.clear()
    location.reload()
  }, 1000)
}

let lastTime
axios.interceptors.request.use(
  (config) => {
    startProgress()
    const token = getToken()
    if (token && lastTime && Date.now() - lastTime > 3600000) {
      // 超过一个小时未操作回登陆页
      logout()
      return false
    } else if (
      token &&
      (!lastTime || (lastTime && Date.now() - lastTime <= 3600000))
    ) {
      lastTime = Date.now()
      config.headers['Authorization'] = token
    }
    config.baseURL = import.meta.env.VITE_BASE_URL
    return config
  },
  (err) => Promise.reject(err),
)

axios.interceptors.response.use(
  (res) => {
    // res.data (data, error)
    const { error } = res.data
    if (error) {
      ElMessage.error(error)
      endProgress()
      return Promise.reject(error)
    }
    endProgress()
    return res.data
  },
  (err) => {
    console.error(err)
    const { response } = err
    if (response?.status === 401) {
      ElMessage.error(t('messages.tokenInvalid'))
      logout()
    } else {
      ElMessage.error(`${err}`)
    }
    endProgress()
    return Promise.reject(err)
  },
)

export default axios
