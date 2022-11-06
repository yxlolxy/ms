import {
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export class BaseModel {
  @PrimaryGeneratedColumn()
  id: number

  @Index('update_time')
  @UpdateDateColumn()
  updateTime: Date

  @Index('create_time')
  @CreateDateColumn()
  createTime: Date
}
