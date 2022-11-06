|-- undefined
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
    |   |-- index.ts
    |   |-- init.sql
    |-- public
    |   |-- test
    |-- src
    |   |-- main.ts
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
    |   |-- filters
    |   |   |-- exceptions.filter.ts
    |   |-- interceptors
    |   |   |-- auth.interceptor.ts
    |   |-- models
    |   |   |-- base.module.ts
    |   |   |-- permission.model.ts
    |   |   |-- role-permission.model.ts
    |   |   |-- role.module.ts
    |   |   |-- user-role.model.ts
    |   |   |-- user.model.ts
    |   |-- modules
    |   |   |-- app.module.ts
    |   |   |-- common
    |   |       |-- auth.module.ts
    |   |       |-- database.module.ts
    |   |       |-- exception.module.ts
    |   |       |-- resource.module.ts
    |   |-- services
    |   |   |-- base.service.ts
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
