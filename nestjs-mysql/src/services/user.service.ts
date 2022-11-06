import { Injectable } from '@nestjs/common'
import {
  InjectDataSource,
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm'
import { UserDto } from 'src/controllers/dto/user.dto'
import { UserRoleModel } from 'src/models/user-role.model'
import { copyObj } from 'src/utils/index.util'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { UserModel } from '../../src/models/user.model'
import { BaseService } from './base.service'
import { PermissionService } from './permission.service'

@Injectable()
export class UserService extends BaseService {
  constructor(
    private readonly permissionService: PermissionService,
    @InjectDataSource('ms')
    private readonly dataSource: DataSource,
    @InjectEntityManager('ms')
    private readonly entityManager: EntityManager,
    @InjectRepository(UserModel, 'ms')
    private readonly userRepository: Repository<UserModel>,
  ) {
    super(dataSource, entityManager, userRepository, UserModel)
  }

  async userDetail(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    })
    const roleIds = (
      (await this.entityManager.query(
        `select r.id from user_role ur join role r on r.id = ur.roleId where ur.userId = ? `,
        [userId],
      )) ?? []
    ).map((item) => item.id)
    return {
      ...user,
      roleIds,
    }
  }

  async getUserPermissions(userId: number) {
    if (userId === 1) {
      return await this.permissionService.find({
        select: ['id', 'pId', 'name', 'title', 'isPage'],
      })
    }
    return await this.entityManager.query(
      `select p.id, p.pId, p.name, p.title, p.isPage from user_role ur join role_permission rp on rp.roleId = ur.roleId join permission p on p.id = rp.permissionId where ur.userId = ?`,
      [userId],
    )
  }

  async saveOrUptUser(userDto: UserDto) {
    await this.dataSource.transaction(async (manager) => {
      const user = await manager.save(
        copyObj(
          userDto,
          new UserModel(),
          userDto.id ? ['id', 'username'] : ['username', 'password'],
        ),
      )
      if (userDto.id) {
        await manager.delete(UserRoleModel, {
          userId: userDto.id,
        })
      }
      for (const roleId of userDto?.roleIds ?? []) {
        await manager.save(
          UserRoleModel,
          copyObj(
            {
              roleId,
              userId: userDto.id ?? user.id,
            },
            new UserRoleModel(),
          ),
        )
      }
    })
  }

  async removeUser(data: number | number[]) {
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(UserModel, data)
      const userIds = Array.isArray(data) ? data : [data]
      for (const userId of userIds) {
        await manager.delete(UserRoleModel, {
          userId,
        })
      }
    })
  }
}
