import { BaseDto } from './base.dto'

export class PermissionDto extends BaseDto {
  pId?: number
  name: string
  title?: string
  isPage?: boolean
}
