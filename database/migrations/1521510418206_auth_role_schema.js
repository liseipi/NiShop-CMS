'use strict'

const Schema = use('Schema')

class AuthRoleSchema extends Schema {
  up () {
    this.create('ni_auth_roles', (table) => {
      table.increments('ni_id')
      table.string('role_name', 12)
      table.string('role_desc', 255)
      table.text('role_auth')
    })
    .raw("ALTER TABLE `ni_auth_roles` AUTO_INCREMENT=10")
  }

  down () {
    this.drop('ni_auth_roles')
  }
}

module.exports = AuthRoleSchema
