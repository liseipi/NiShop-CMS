'use strict'

const Schema = use('Schema')

class MemberUserInfoSchema extends Schema {
  up () {
    this.create('ni_member_info', (table) => {
      table.increments('ni_id')
      table.string('username', 64)
      table.string('password', 32)
      table.string('email', 64)
      table.string('mobile', 12)
      table.boolean('status').defaultTo(false).comment('开/关登录状态')
      table.string('avatar', 32).comment('头像')
      table.integer('level', 1).defaultTo(0).comment('会员级别')
      table.boolean('sex').defaultTo(false)
      table.timestamp('birthday').comment('生日')
      table.boolean('is_verify_mobile').defaultTo(false).comment('是否验证手机')
      table.boolean('is_verify_email').defaultTo(false).comment('是否验证手机')
      table.integer('visits', 12).defaultTo(0).comment('登录次数')
      table.string('lastIp', 15).comment('上次IP')
      table.timestamp('last_at').comment('上次时间')
      table.string('thisIp', 15).comment('本次IP')
      table.timestamp('this_at').comment('本次时间')
      table.timestamp('create_at').comment('注册时间')
    })
    .raw("ALTER TABLE `ni_member_info` AUTO_INCREMENT=659680")
  }

  down () {
    this.drop('ni_member_info')
  }
}

module.exports = MemberUserInfoSchema
