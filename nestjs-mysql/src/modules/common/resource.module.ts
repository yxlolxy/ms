import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import config from 'config'

const serveStaticModuleOptions = config.staticPaths.map((item) => ({
  rootPath: item,
  exclude: [`/${config.apiPrefix}*`],
}))

@Module({
  imports: [ServeStaticModule.forRoot(...serveStaticModuleOptions)],
  exports: [ServeStaticModule],
})
export class ResourceModule {}
