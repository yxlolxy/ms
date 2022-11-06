import { Column, Entity } from 'typeorm'
import { BaseModel } from './base.module'

@Entity('user')
export class UserModel extends BaseModel {
  @Column({ unique: true })
  username: string

  @Column()
  password: string
}
