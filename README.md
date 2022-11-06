### 使用说明
1. 目录说明
* nestjs-mysql 
```
|-- nestjs-mysql
    |-- .eslintignore
    |-- .eslintrc.js
    |-- .prettierignore
    |-- .prettierrc.js
    |-- nest-cli.json
    |-- package.json
    |-- README.md
    |-- tsconfig.build.json
    |-- tsconfig.json
    |-- yarn.lock
    |-- config
    |   |-- index.ts // ！！！基本配置
    |   |-- init.sql // ！！！mysql 初始化数据脚本
    |-- public
    |   |-- test
    |-- src
    |   |-- main.ts // 入口
    |   |-- controllers
    |   |   |-- index.controller.ts
    |   |   |-- permission.controller.ts
    |   |   |-- role.controller.ts
    |   |   |-- user.controller.ts
    |   |   |-- dto
    |   |       |-- base.dto.ts
    |   |       |-- permission.dto.ts
    |   |       |-- role.dto.ts
    |   |       |-- user.dto.ts
    |   |-- filters // ！！！ 全局异常过滤器
    |   |   |-- exceptions.filter.ts
    |   |-- interceptors // ！！！ 全局授权拦截器
    |   |   |-- auth.interceptor.ts
    |   |-- models
    |   |   |-- base.module.ts 
    |   |   |-- permission.model.ts // 权限表
    |   |   |-- role-permission.model.ts // 角色权限表
    |   |   |-- role.module.ts // 角色表
    |   |   |-- user-role.model.ts // 用户角色表
    |   |   |-- user.model.ts // 用户表
    |   |-- modules
    |   |   |-- app.module.ts // 入口模块
    |   |   |-- common
    |   |       |-- auth.module.ts // 授权模块
    |   |       |-- database.module.ts // 数据库模块
    |   |       |-- exception.module.ts // 异常模块
    |   |       |-- resource.module.ts // 静态资源模块
    |   |-- services
    |   |   |-- base.service.ts // 基本crud操作封装
    |   |   |-- permission.service.ts
    |   |   |-- role.service.ts
    |   |   |-- user.service.ts
    |   |-- types
    |   |   |-- http.type.ts 
    |   |-- utils
    |       |-- cache.util.ts
    |       |-- crypto.util.ts 
    |       |-- date.util.ts 
    |       |-- db.util.ts 
    |       |-- http.util.ts
    |       |-- index.util.ts
    |-- upload
        |-- test

```
* vue3-elementui
```
|-- undefined
    |-- .env.development
    |-- .env.production
    |-- .eslintignore
    |-- .eslintrc.cjs
    |-- .prettierignore
    |-- .prettierrc.js
    |-- index.html
    |-- package.json
    |-- README.md
    |-- vite.config.js
    |-- yarn.lock
    |-- public
    |   |-- favicon.ico
    |-- src
        |-- App.vue
        |-- main.js
        |-- api
        |   |-- app.js
        |   |-- axios.js  // ！！！ axios配置拦截器
        |   |-- index.js
        |   |-- menu.js
        |   |-- role.js
        |   |-- user.js
        |-- assets
        |   |-- img
        |   |   |-- img.jpg
        |   |   |-- login-bg.jpg
        |   |-- styles
        |       |-- element.less // ！！！覆盖elment样式
        |       |-- index.less // 入口样式
        |-- components
        |   |-- table
        |       |-- index.vue
        |-- layout 
        |   |-- aside-menu.vue // 侧边栏
        |   |-- index.vue
        |   |-- router-view.vue // 路由中继界面
        |   |-- tab-bar.vue // tab栏
        |   |-- tool-bar.vue // 顶部工具栏
        |-- locales // 国际化文件，包含element国际化和i18n国际化
        |   |-- en.js
        |   |-- index.js
        |   |-- zh.js
        |-- router
        |   |-- index.js
        |   |-- routes.js
        |-- store // pinia状态管理
        |   |-- app.js
        |-- utils
        |   |-- nprogress.js // 顶部进度条工具，请求和页面切换会触发
        |   |-- permission.js
        |   |-- router.js
        |   |-- storage.js
        |-- views
            |-- index.vue
            |-- 401
            |   |-- index.vue
            |-- 404
            |   |-- index.vue
            |-- login
            |   |-- index.vue
            |-- system
                |-- menu // 菜单
                |   |-- index.vue
                |   |-- menu-dialog.vue
                |-- role // 角色
                |   |-- index.vue
                |   |-- role-dialog.vue
                |-- user // 用户
                    |-- index.vue
                    |-- user-dialog.vue
```

2. 安装步骤

（1）*nestjs-mysql*和*vue3-elementui*目录下分别执行yarn安装依赖；

（2）*mysql*新建**ms**数据库，更改*nestjs-mysql/config/index.ts*中mysql的用户名和密码，*nestjs-mysql*目录下执行`yarn dev`，生成基本数据表；

（3）在数据库管理工具上执行脚本*nestjs-mysql/config/init.sql*生成初始数据

（4）切换到*vue3-elementui*执行`yarn dev`，并访问指定网址

>更多细节请参考文章内容