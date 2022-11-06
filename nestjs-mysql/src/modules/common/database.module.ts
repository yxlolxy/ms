import { DynamicModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from 'config'
import { PermissionModel } from 'src/models/permission.model'
import { RolePermissionModel } from 'src/models/role-permission.model'
import { RoleModel } from 'src/models/role.module'
import { UserRoleModel } from 'src/models/user-role.model'
import { UserModel } from 'src/models/user.model'

const { mysql } = config
const models = [
  UserModel,
  PermissionModel,
  RoleModel,
  UserRoleModel,
  RolePermissionModel,
]

const sequelizeModules: DynamicModule[] = mysql.reduce((acc, cur) => {
  return acc.concat(
    TypeOrmModule.forRoot(cur),
    TypeOrmModule.forFeature(models, cur.name),
  )
}, [])

@Module({
  imports: [...sequelizeModules],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
