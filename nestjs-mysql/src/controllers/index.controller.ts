import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import config from 'config'
import { Request } from 'express'
import { UserService } from 'src/services/user.service'
import { cache } from 'src/utils/cache.util'
import { getRsaPubKey, hashMac } from 'src/utils/crypto.util'
import { getRedisClient, response } from 'src/utils/http.util'
import { v4 } from 'uuid'
import { UserDto } from './dto/user.dto'
import * as svgCapcha from 'svg-captcha'

@Controller()
export class IndexController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('getValidateCode')
  async getValidateCode(@Query('key') key: string) {
    if (key) {
      cache.validateCodeMap.delete(key)
    }
    const _key = v4()
    const { text, data } = svgCapcha.create({
      inverse: true,
    })
    const val = text // 可采用base64图片
    cache.validateCodeMap.set(_key, val)
    return response.success<{
      key: string
      img: string
    }>({
      key: _key,
      img: data,
    })
  }

  @Post('login')
  async login(@Body() userDto: UserDto) {
    if (!userDto.username) {
      return response.fail('用户名不能为空！')
    }
    if (!userDto.password) {
      return response.fail('密码不能为空！')
    }
    if (!userDto.validateCode) {
      return response.fail('验证码不能为空！')
    }
    if (
      !cache.validateCodeMap.has(userDto.validateCodeKey) ||
      cache.validateCodeMap.get(userDto.validateCodeKey).toLowerCase() !==
        userDto.validateCode.toLowerCase()
    ) {
      return response.fail('验证码错误！')
    }
    const token = this.jwtService.sign({ username: userDto.username })
    cache.validateCodeMap.delete(userDto.validateCodeKey)
    if (config.redis.enable) {
      const redisClient = getRedisClient()
      await redisClient.hset('loginTokenList', token, 1)
    } else {
      cache.loginTokenList.push(token)
    }
    const result = await this.userService.find({
      where: {
        username: {
          type: 'Equal',
          value: userDto.username,
        },
        password: {
          type: 'Equal',
          value: hashMac(userDto.password),
        },
      },
      select: ['id', 'username'],
    })
    if (result?.length) {
      const permissions = await this.userService.getUserPermissions(
        result[0].id,
      )
      return response.success<{
        user: any
        token: string
        permissions: any[]
      }>({ user: result[0], token, permissions })
    } else {
      return response.fail('用户名或密码错误')
    }
  }

  @Get('logout')
  async logout(@Req() req: Request) {
    const token = req.header('Authorization')
    if (config.redis.enable) {
      const redisClient = getRedisClient()
      await redisClient.hdel('loginTokenList', token)
    } else {
      cache.loginTokenList = cache.loginTokenList.filter(
        (item) => item !== token,
      )
    }
    return response.success(true)
  }

  @Post('register')
  async register(@Body() userDto: UserDto) {
    if (userDto.username !== 'test' && userDto.password !== '123456') {
      return response.fail('用户名或密码不匹配！')
    }
    if (
      cache.validateCodeMap.get(userDto.validateCodeKey) !==
      userDto.validateCode
    ) {
      cache.validateCodeMap.delete(userDto.validateCodeKey)
      return response.fail('验证码错误！')
    }
    const token = this.jwtService.sign({ username: userDto.username })
    cache.validateCodeMap.delete(userDto.validateCodeKey)
    return response.success<{
      token: string
    }>({ token })
  }

  @Get('getPubKey')
  async getPubKey() {
    return response.success<string>(getRsaPubKey())
  }

  // @Get('test')
  // async test() {
  //   const data = await this.permissionService.getUserPermissions(2)
  //   return response.success<any>(data)
  // }
}
