import { BaseDto } from './base.dto'
export class UserDto extends BaseDto {
  username?: string
  oldPassword?: string
  password?: string
  validateCodeKey?: string
  validateCode?: string
  roleIds?: number[]
  createTimeSort?: 'ASC' | 'DESC'
}
