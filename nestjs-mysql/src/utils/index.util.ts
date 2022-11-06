export type CopyObjKeyType =
  | string
  | {
      sourceKey: string
      targetKey?: string
      converter?: (any) => any
    }
/**
 *
 * @param source 源对象
 * @param target 目标对象
 * @param keys 字符串数组，或者属性转换键值对、转换器数组
 * @returns 转换后的对象
 */
export const copyObj = (source: any, target: any, keys?: CopyObjKeyType[]) => {
  keys = keys ?? Object.keys(source)
  for (const key of keys) {
    if (typeof key === 'string') {
      if (key in source) {
        target[key] = source[key]
      }
    } else {
      if (key.sourceKey in source) {
        target[key.targetKey ?? key.sourceKey] = key.converter
          ? key.converter(source.sourceKey)
          : source.sourceKey
      }
    }
  }
  return target
}
