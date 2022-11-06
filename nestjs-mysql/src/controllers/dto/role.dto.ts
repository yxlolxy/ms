import { BaseDto } from './base.dto'

export class RoleDto extends BaseDto {
  name?: string
  permissionIds?: number[]
}
