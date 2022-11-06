import { Column, Entity, Index } from 'typeorm'
import { BaseModel } from './base.module'

@Entity('user_role')
export class UserRoleModel extends BaseModel {
  @Index('user_id')
  @Column()
  userId: number

  @Index('role_id')
  @Column()
  roleId: number
}
