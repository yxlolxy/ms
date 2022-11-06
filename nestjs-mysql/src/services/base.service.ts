import {
  getWhereCriteria,
  OrderCriteria,
  WhereCriteria,
} from 'src/utils/db.util'
import { copyObj, CopyObjKeyType } from 'src/utils/index.util'
import { DataSource, EntityManager, In, Repository } from 'typeorm'

export class BaseService<T = any> {
  private readonly baseDataSource
  private readonly baseEntityManager
  private readonly baseRepository
  private readonly modelType
  constructor(
    baseDataSource: DataSource,
    baseEntityManager: EntityManager,
    baseRepository: Repository<T>,
    modelType,
  ) {
    this.baseDataSource = baseDataSource
    this.baseEntityManager = baseEntityManager
    this.baseRepository = baseRepository
    this.modelType = modelType
  }

  /**
   * 保存或者更新单个或者多条记录
   * @param data 对象或数组
   * @param Model 实体类
   * @param fields 保存的字段
   */
  async saveOrUpt(data: T | T[], fields: CopyObjKeyType[]) {
    if (Array.isArray(data)) {
      await this.baseDataSource.transaction(async (manager) => {
        for (const item of data) {
          await manager.save(copyObj(item, new this.modelType(), fields))
        }
      })
    } else {
      await this.baseRepository.save(
        copyObj(data, new this.modelType(), fields),
      )
    }
  }

  /**
   * 删除单个或者多个记录
   * @param data id或ids
   * @param Model 实体类
   */
  async removeByIdOrIds(data: number | number[]) {
    await this.baseRepository.delete(data)
  }

  /**
   * 通过ID或者IDS查询单个或者多条记录
   * @param data id或者ids
   * @returns 数组
   */
  async findByIdOrIds(data: number | number[]) {
    return await this.baseRepository.findBy({
      id: Array.isArray(data) ? In(data) : data,
    })
  }

  /**
   * 复杂查询
   * @param criteria 查询条件
   * @returns 数组
   */
  async find(criteria?: {
    pageNum?: number
    pageSize?: number
    order?: OrderCriteria
    where?: WhereCriteria | WhereCriteria[]
    select?: string[]
  }) {
    if (!criteria) return await this.baseRepository.find()
    const { pageNum, pageSize, order, where, select } = criteria
    const skip = pageNum && pageSize ? (pageNum - 1) * pageSize : undefined
    const take = pageNum && pageSize ? pageSize : undefined
    if (skip !== undefined && take !== undefined) {
      return {
        total: await this.baseRepository.count({
          where: getWhereCriteria(where),
        }),
        list: await this.baseRepository.find({
          select,
          where: getWhereCriteria(where),
          skip,
          take,
          order,
        }),
      }
    }
    return await this.baseRepository.find({
      select,
      where: getWhereCriteria(where),
      skip,
      take,
      order,
    })
  }
}
