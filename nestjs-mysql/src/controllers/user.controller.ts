import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Query,
  Req,
} from '@nestjs/common'
import config from 'config'
import { Request } from 'express'
import { UserService } from 'src/services/user.service'
import { cache } from 'src/utils/cache.util'
import { hashMac } from 'src/utils/crypto.util'
import { getRedisClient, response } from 'src/utils/http.util'
import { UserDto } from './dto/user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('userList')
  async userList(@Body() userDto: UserDto) {
    if (
      !userDto.pageNum ||
      !userDto.pageSize ||
      userDto.pageNum < 0 ||
      userDto.pageSize < 0
    ) {
      return response.fail('分页查询参数有误')
    }
    const data = await this.userService.find({
      pageNum: userDto.pageNum,
      pageSize: userDto.pageSize,
      where: {
        username: {
          type: 'Like',
          value: userDto.username,
        },
        id: {
          type: 'MoreThan',
          value: 1, //过滤掉超级用户
        },
      },
      select: ['id', 'username', 'updateTime', 'createTime'],
      order: {
        createTime: userDto.createTimeSort,
      },
    })
    return response.success(data)
  }

  @Post('addUser')
  async addUser(@Body() userDto: UserDto) {
    if (!userDto.username) return response.fail('用户名不能为空')
    if (!userDto.roleIds?.length) return response.fail('用户角色不能为空')
    userDto.password = hashMac('123456')
    await this.userService.saveOrUptUser(userDto)
    return response.success<boolean>(true)
  }

  @Post('uptUser')
  async uptUser(@Body() userDto: UserDto) {
    if (!userDto.id) return response.fail('用户ID不能为空')
    if (!userDto.username) return response.fail('用户名不能为空')
    if (!userDto.roleIds?.length) return response.fail('用户角色不能为空')
    await this.userService.saveOrUptUser(userDto)
    return response.success<boolean>(true)
  }

  @Post('uptUserPwd')
  async uptUserPwd(@Req() req: Request, @Body() userDto: UserDto) {
    if (!userDto.id) return response.fail('用户ID不能为空')
    if (!userDto.oldPassword) return response.fail('旧密码不能为空')
    if (!userDto.password) return response.fail('密码不能为空')
    const user = await this.userService.findByIdOrIds(userDto.id)
    if (user.password !== hashMac(userDto.password)) {
      return response.fail('旧密码错误')
    }
    userDto.password = hashMac(userDto.password)
    await this.userService.saveOrUpt(userDto, ['id', 'password'])
    const token = req.header('Authorization')
    if (config.redis.enable) {
      const redisClient = getRedisClient()
      await redisClient.hdel('loginTokenList', token)
    } else {
      cache.loginTokenList = cache.loginTokenList.filter(
        (item) => item !== token,
      )
    }
    return response.success<boolean>(true)
  }

  @Get('userDetail/:id')
  async userDetail(@Param('id') id: number) {
    if (!id) return response.fail('用户ID不能为空')
    const user = await this.userService.userDetail(id)
    return response.success<any>(user)
  }

  @Delete('delUser/:id')
  async delUser(@Param('id') id: number) {
    if (!id) return response.fail('用户ID不能为空')
    await this.userService.removeUser(id)
    return response.success<boolean>(true)
  }
}
