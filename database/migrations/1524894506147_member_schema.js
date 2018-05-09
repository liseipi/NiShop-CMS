'use strict'

const Schema = use('Schema')

class MemberSchema extends Schema {
  up () {
    this.create('ni_member', (table) => {
      table.increments('ni_id')
      table.string('username', 64)
      table.string('password', 32)
      table.string('email', 64)
      table.string('mobile', 12)
      table.boolean('status').defaultTo(false).comment('开/关登录状态')
      table.string('avatar', 32).comment('头像')
      table.integer('level', 1).defaultTo(0).comment('会员级别')
      table.boolean('sex').defaultTo(false)
      table.bigInteger('birthday').comment('生日')
      table.boolean('is_verify_mobile').defaultTo(false).comment('是否验证手机')
      table.boolean('is_verify_email').defaultTo(false).comment('是否验证手机')
      table.integer('visits', 12).defaultTo(0).comment('登录次数')
      table.integer('source', 2).defaultTo(0).comment('注册来源(0:站内)(1:微信)')
      table.integer('device', 2).defaultTo(0).comment('注册终端设备(0:PC)(1:Mobile)(2:APP)')
      table.string('lastIp', 15).comment('上次IP')
      table.bigInteger('last_at').defaultTo(this.fn.now()).comment('上次时间')
      table.string('thisIp', 15).comment('本次IP')
      table.bigInteger('this_at').defaultTo(this.fn.now()).comment('本次时间')
      table.bigInteger('create_at').defaultTo(this.fn.now()).comment('注册时间')
    })
    .raw("ALTER TABLE `ni_member` AUTO_INCREMENT=659680")
  }

  down () {
    this.drop('members')
  }
}

module.exports = MemberSchema
