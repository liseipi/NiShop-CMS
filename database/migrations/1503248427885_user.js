'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('ni_admin_user', table => {
      table.increments('ni_id')
      table.string('username', 64).notNullable().unique()
      table.string('email', 64).notNullable().unique()
      table.string('password', 64).notNullable()
      table.integer('mobile', 11)
      table.integer('user_level', 1)
      table.boolean('user_sex')
      table.timestamp('birthday')
      table.string('lastIp', 15)
      table.string('thisIp', 15)
      table.integer('status', 1)
      table.integer('frequency', 1)
      table.text('auth')
      table.timestamp('lastdate')
      table.timestamps()
    })
  }

  down () {
    this.drop('ni_admin_user')
  }
}

module.exports = UserSchema
