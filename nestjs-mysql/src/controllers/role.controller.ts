import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { RoleService } from 'src/services/role.service'
import { response } from 'src/utils/http.util'
import { RoleDto } from './dto/role.dto'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('roleList')
  async roleList(@Body() roleDto: RoleDto) {
    const data = await this.roleService.find({
      pageNum: roleDto.pageNum,
      pageSize: roleDto.pageSize,
      where: {
        name: {
          type: 'Like',
          value: roleDto.name,
        },
      },
      select: ['id', 'name', 'updateTime', 'createTime'],
    })
    return response.success(data)
  }

  @Get('roleDetail/:id')
  async roleDetail(@Param('id') id: number) {
    if (!id) return response.fail('用户ID不能为空')
    const user = await this.roleService.roleDetail(id)
    return response.success<any>(user)
  }

  @Get('getRolePermissions/:id')
  async getRolePermissions(@Param('id') id: number) {
    if (!id) return response.fail('角色ID不能为空')
    const data = await this.roleService.roleDetail(id)
    return response.success<any>(data)
  }

  @Post('addRole')
  async addRole(@Body() roleDto: RoleDto) {
    if (!roleDto.name) return response.fail('角色名不能为空')
    await this.roleService.saveOrUptRole(roleDto, ['name'])
    return response.success<boolean>(true)
  }

  @Post('uptRole')
  async uptRole(@Body() roleDto: RoleDto) {
    if (!roleDto.id) return response.fail('角色ID不能为空')
    if (!roleDto.name) return response.fail('角色名不能为空')
    await this.roleService.saveOrUptRole(roleDto, ['id', 'name'])
    return response.success<boolean>(true)
  }

  @Delete('delRole/:id')
  async delRole(@Param('id') id: number) {
    if (!id) return response.fail('角色ID不能为空')
    await this.roleService.removeRole(id)
    return response.success<boolean>(true)
  }
}
