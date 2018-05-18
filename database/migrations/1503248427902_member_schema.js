'use strict'

const Schema = use('Schema')

class MemberSchema extends Schema {
  up () {
    this.create('ni_member', (table) => {
      table.increments('ni_id')
      table.string('username', 64).notNullable().comment('会员名称')
      table.string('password', 32).notNullable().comment('密码')
      table.string('email', 64).unique().comment('邮箱')
      table.bigInteger('mobile', 12).unique().comment('手机')
      table.boolean('status').defaultTo(false).comment('开/关登录状态')
      table.string('avatar', 64).comment('头像图片')
      table.integer('level', 1).defaultTo(0).comment('会员级别')
      table.boolean('user_sex').defaultTo(false)
      table.bigInteger('birthday').comment('生日')
      table.boolean('is_verify_mobile').defaultTo(false).comment('是否验证手机')
      table.boolean('is_verify_email').defaultTo(false).comment('是否验证手机')
      table.string('verify_send_code').comment('发送的验证码')
      table.string('verify_send_number').comment('连续发送的次数')
      table.string('verify_send_time').comment('上次发送的时间')
      table.integer('access_count', 12).defaultTo(0).comment('登录次数')
      table.integer('source', 2).defaultTo(0).comment('注册来源(0:站内)(1:后台)(2:微信)')
      table.integer('device', 2).defaultTo(0).comment('注册终端设备(0:PC)(1:Mobile)(2:APP)')
      table.string('lastIp', 15).comment('上次IP')
      table.bigInteger('last_at').comment('上次时间')
      table.string('thisIp', 15).comment('本次IP')
      table.bigInteger('this_at').comment('本次时间')
      table.bigInteger('create_at').comment('注册时间')
    })
    .raw("ALTER TABLE `ni_member` AUTO_INCREMENT=659680")
  }

  down () {
    this.drop('members')
  }
}

module.exports = MemberSchema
