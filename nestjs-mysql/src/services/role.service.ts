import { Injectable } from '@nestjs/common'
import {
  InjectDataSource,
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm'
import { RoleDto } from 'src/controllers/dto/role.dto'
import { RolePermissionModel } from 'src/models/role-permission.model'
import { RoleModel } from 'src/models/role.module'
import { copyObj, CopyObjKeyType } from 'src/utils/index.util'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { BaseService } from './base.service'

@Injectable()
export class RoleService extends BaseService {
  constructor(
    @InjectDataSource('ms')
    private readonly dataSource: DataSource,
    @InjectEntityManager('ms')
    private readonly entityManager: EntityManager,
    @InjectRepository(RoleModel, 'ms')
    private readonly roleRepository: Repository<RoleModel>,
  ) {
    super(dataSource, entityManager, roleRepository, RoleModel)
  }

  async roleDetail(roldId: number) {
    const role = await this.roleRepository.findOneBy({
      id: roldId,
    })
    const permissionIds = (
      (await this.entityManager.query(
        `select p.id from role_permission rp join permission p on p.id = rp.permissionId where rp.roleId = ? `,
        [roldId],
      )) ?? []
    ).map((item) => item.id)
    return {
      ...role,
      permissionIds,
    }
  }

  async saveOrUptRole(roleDto: RoleDto, fields: CopyObjKeyType[]) {
    await this.dataSource.transaction(async (manager) => {
      const role = await manager.save(copyObj(roleDto, new RoleModel(), fields))
      await manager.delete(RolePermissionModel, {
        roleId: role.id,
      })
      for (const id of roleDto.permissionIds ?? []) {
        await manager.save(
          copyObj(
            {
              roleId: role.id,
              permissionId: id,
            },
            new RolePermissionModel(),
          ),
        )
      }
    })
  }

  async removeRole(data: number | number[]) {
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(RoleModel, data)
      const roleIds = Array.isArray(data) ? data : [data]
      for (const roleId of roleIds) {
        await manager.delete(RolePermissionModel, {
          roleId,
        })
      }
    })
  }
}
