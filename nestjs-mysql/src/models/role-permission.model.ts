import { Column, Entity, Index } from 'typeorm'
import { BaseModel } from './base.module'

@Entity('role_permission')
export class RolePermissionModel extends BaseModel {
  @Index('role_id')
  @Column()
  roleId: number

  @Index('permission_id')
  @Column()
  permissionId: number
}
