import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common'
import { PermissionService } from 'src/services/permission.service'
import { response } from 'src/utils/http.util'
import { PermissionDto } from './dto/permission.dto'

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('getAllPermissions')
  async getAllPermissions() {
    const list = await this.permissionService.find()
    return response.success<any[]>(list)
  }

  @Post('addPermission')
  async addPermission(@Body() permissionDto: PermissionDto) {
    if (!permissionDto.name) return response.fail('菜单名称不能为空')
    if (!permissionDto.title) return response.fail('菜单标签不能为空')
    let result
    if (!permissionDto.isPage) {
      result = await this.permissionService.find({
        where: {
          name: {
            type: 'Equal',
            value: permissionDto.name,
          },
          isPage: {
            type: 'Equal',
            value: false,
          },
        },
      })
    } else {
      result = await this.permissionService.find({
        where: {
          name: {
            type: 'Equal',
            value: permissionDto.name,
          },
          isPage: {
            type: 'Equal',
            value: true,
          },
          pId: permissionDto.pId
            ? {
                type: 'Equal',
                value: permissionDto.pId,
              }
            : {
                type: 'IsNull',
              },
        },
      })
    }
    if (result?.length) {
      return response.fail('同名菜单已存在')
    }
    result = await this.permissionService.find({
      where: {
        title: {
          type: 'Equal',
          value: permissionDto.title,
        },
        pId: permissionDto.pId
          ? {
              type: 'Equal',
              value: permissionDto.pId,
            }
          : {
              type: 'IsNull',
            },
      },
    })
    if (result?.length) {
      return response.fail('同一目录下菜单标签不能重名')
    }
    await this.permissionService.saveOrUpt(
      permissionDto,
      permissionDto.id
        ? ['id', 'pId', 'name', 'title', 'isPage']
        : ['pId', 'name', 'title', 'isPage'],
    )
    return response.success<boolean>(true)
  }

  @Post('uptPermission')
  async uptPermission(@Body() permissionDto: PermissionDto) {
    if (!permissionDto.id) return response.fail('菜单ID不能为空')
    if (!permissionDto.name) return response.fail('菜单名称不能为空')
    if (!permissionDto.title) return response.fail('菜单标签不能为空')
    let result
    if (!permissionDto.isPage) {
      result = await this.permissionService.find({
        where: {
          name: {
            type: 'Equal',
            value: permissionDto.name,
          },
          isPage: {
            type: 'Equal',
            value: false,
          },
          id: {
            type: 'Not',
            value: permissionDto.id,
          },
        },
      })
    } else {
      result = await this.permissionService.find({
        where: {
          name: {
            type: 'Equal',
            value: permissionDto.name,
          },
          isPage: {
            type: 'Equal',
            value: true,
          },
          id: {
            type: 'Not',
            value: permissionDto.id,
          },
          pId: permissionDto.pId
            ? {
                type: 'Equal',
                value: permissionDto.pId,
              }
            : {
                type: 'IsNull',
              },
        },
      })
    }
    if (result?.length) {
      return response.fail('同名菜单已存在')
    }
    result = await this.permissionService.find({
      where: {
        title: {
          type: 'Equal',
          value: permissionDto.title,
        },
        id: {
          type: 'Not',
          value: permissionDto.id,
        },
        pId: permissionDto.pId
          ? {
              type: 'Equal',
              value: permissionDto.pId,
            }
          : {
              type: 'IsNull',
            },
      },
    })
    if (result?.length) {
      return response.fail('同一目录下菜单标签不能重名')
    }
    await this.permissionService.saveOrUpt(
      permissionDto,
      permissionDto.id
        ? ['id', 'pId', 'name', 'title', 'isPage']
        : ['pId', 'name', 'title', 'isPage'],
    )
    return response.success<boolean>(true)
  }

  @Delete('delPermission/:id')
  async delUser(@Param('id') id: number) {
    if (!id) return response.fail('菜单ID不能为空')
    await this.permissionService.removeByIdOrIds(id)
    return response.success<boolean>(true)
  }
}
