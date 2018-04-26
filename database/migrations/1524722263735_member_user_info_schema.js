'use strict'

const Schema = use('Schema')

class MemberUserInfoSchema extends Schema {
  up () {
    this.create('ni_member_user_info', (table) => {
      table.increments('ni_id')
      //table.integer('member_id', 10).unique().unsigned().notNullable().primary()
      table.string('username', 64)
      table.string('mobile', 12)
      table.string('email', 64)
      table.string('password', 32)
      table.string('Avatar', 32)
      table.integer('level', 1)
      table.boolean('sex').defaultTo(false)
      table.timestamp('birthday')
      table.boolean('is_verify_mobile').defaultTo(false)
      table.boolean('is_verify_email').defaultTo(false)
      table.integer('visits', 12)
      table.timestamps()
    })
  }

  down () {
    this.drop('ni_member_user_info')
  }
}

module.exports = MemberUserInfoSchema
