import { Module } from '@nestjs/common'
import { IndexController } from 'src/controllers/index.controller'
import { PermissionController } from 'src/controllers/permission.controller'
import { RoleController } from 'src/controllers/role.controller'
import { UserController } from 'src/controllers/user.controller'
import { PermissionService } from 'src/services/permission.service'
import { RoleService } from 'src/services/role.service'
import { UserService } from 'src/services/user.service'
import { AuthModule } from './common/auth.module'
import { DatabaseModule } from './common/database.module'
import { ExceptionModule } from './common/exception.module'
import { ResourceModule } from './common/resource.module'

@Module({
  imports: [AuthModule, DatabaseModule, ResourceModule, ExceptionModule],
  providers: [UserService, PermissionService, RoleService],
  controllers: [
    IndexController,
    PermissionController,
    RoleController,
    UserController,
  ],
})
export class AppModule {}
