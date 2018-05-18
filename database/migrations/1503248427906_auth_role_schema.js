'use strict'

const Schema = use('Schema')

class AuthRoleSchema extends Schema {
  up () {
    this.create('ni_auth_roles', (table) => {
      table.increments('ni_id')
      table.string('role_name', 12).notNullable().comment('角色名称')
      table.string('role_desc', 255).comment('角色描述')
      table.text('role_auth').notNullable().comment('角色权限')
    })
    .raw("ALTER TABLE `ni_auth_roles` AUTO_INCREMENT=10")
  }

  down () {
    this.drop('ni_auth_roles')
  }
}

module.exports = AuthRoleSchema
