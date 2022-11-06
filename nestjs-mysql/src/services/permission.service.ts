import { Injectable } from '@nestjs/common'
import {
  InjectDataSource,
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm'
import { PermissionDto } from 'src/controllers/dto/permission.dto'
import { PermissionModel } from 'src/models/permission.model'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { BaseService } from './base.service'

@Injectable()
export class PermissionService extends BaseService {
  constructor(
    @InjectDataSource('ms')
    private readonly dataSource: DataSource,
    @InjectEntityManager('ms')
    private readonly entityManager: EntityManager,
    @InjectRepository(PermissionModel, 'ms')
    private readonly permissionRepository: Repository<PermissionModel>,
  ) {
    super(dataSource, entityManager, permissionRepository, PermissionModel)
  }
}
