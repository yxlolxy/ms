import { Column, Entity, Index } from 'typeorm'
import { BaseModel } from './base.module'

@Entity('permission')
export class PermissionModel extends BaseModel {
  @Index('p_id')
  @Column({ nullable: true })
  pId: number

  @Column()
  name: string

  @Column()
  title: string

  @Column({ default: false })
  isPage: boolean
}
