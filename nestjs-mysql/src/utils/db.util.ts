import * as typeorm from 'typeorm'

export interface OrderCriteria {
  [order: string]: 'ASC' | 'DESC'
}

export interface WhereCriteria {
  [key: string]: {
    type:
      | 'Equal'
      | 'Not'
      | 'LessThan'
      | 'LessThanOrEqual'
      | 'MoreThan'
      | 'MoreThanOrEqual'
      | 'Like'
      | 'Between'
      | 'In'
      | 'Any'
      | 'IsNull'
    value?: any | any[]
    isNot?: boolean
  }
}

/**
 * 获取
 * @param where 数组为或条件, 对象为且条件
 * @returns where条件
 */
export const getWhereCriteria = (where: WhereCriteria | WhereCriteria[]) => {
  let result
  if (Array.isArray(where)) {
    result = where.map((item) => getWhereCriteria(item))
  } else if (where && Object.keys(where).length) {
    result = {}
    Object.keys(where).forEach((key) => {
      const val = where[key]
      let pass = false
      if (val.type === 'Between') {
        if (Array.isArray(val.type) && val.type.length >= 2) {
          result[key] = typeorm[val.type](val.value[0], val.value[1])
          pass = true
        }
      } else if (val.type === 'In' || val.type === 'Any') {
        if (Array.isArray(val.type) && val.type.length) {
          result[key] = typeorm[val.type](val.value)
          pass = true
        }
      } else if (val.type === 'Like') {
        result[key] = typeorm[val.type](`%${val.value ?? ''}%`)
        pass = true
      } else if (val.type === 'IsNull') {
        result[key] = typeorm[val.type]()
        pass = true
      } else if (val.value !== undefined) {
        result[key] = typeorm[val.type](val.value)
        pass = true
      }
      if (val.isNot && pass) {
        result[key] = typeorm.Not(result[key])
      }
    })
  }
  return result
}
