import { Column, Entity } from 'typeorm'
import { BaseModel } from './base.module'

@Entity('role')
export class RoleModel extends BaseModel {
  @Column({ unique: true })
  name: string
}
