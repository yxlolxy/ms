const storeUtil = {
  set(key, value, isSession) {
    const storage = isSession ? sessionStorage : localStorage
    if (value === null || value === undefined) {
      storage.removeItem(key)
      return
    }
    if (typeof value !== 'string') {
      storage.setItem(key, JSON.stringify(value))
    } else {
      storage.setItem(key, value)
    }
  },
  get(key, needParse = false, defaultReturn, isSession) {
    try {
      const storage = isSession ? sessionStorage : localStorage
      const str = storage.getItem(key)
      if (!str) return defaultReturn
      return needParse ? JSON.parse(str) : str
    } catch (error) {
      console.error(error)
      return defaultReturn
    }
  },
  clear(isSession) {
    if (isSession) {
      sessionStorage.clear()
    } else {
      localStorage.clear()
    }
  },
}

export const session = {
  set(key, value) {
    storeUtil.set(key, value, true)
  },
  /**
   * 获取会话数据
   * @param {*} key 键
   * @param {*} needParse 是否需要反序列化
   * @param {*} defaultReturn 默认返回值，默认null
   * @returns
   */
  get(key, needParse = false, defaultReturn = null) {
    return storeUtil.get(key, needParse, defaultReturn, true)
  },
  clear() {
    storeUtil.clear(true)
  },
}

export const locale = {
  set(key, value) {
    storeUtil.set(key, value, false)
  },
  /**
   * 获取会话数据
   * @param {*} key 键
   * @param {*} needParse 是否需要反序列化
   * @param {*} defaultReturn 默认返回值，默认null
   * @returns
   */
  get(key, needParse = false, defaultReturn = null) {
    return storeUtil.get(key, needParse, defaultReturn, false)
  },
  clear() {
    storeUtil.clear(true)
  },
}
