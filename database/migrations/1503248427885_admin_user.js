'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up() {
    this.create('ni_admin_user', table => {
      table.increments('ni_id')
      table.string('username', 64).notNullable().unique().comment('姓名')
      table.string('email', 64).notNullable().unique().comment('邮箱')
      table.string('password', 64).notNullable().comment('密码')
      table.bigInteger('mobile', 11).comment('手机')
      table.integer('user_level', 1).comment('管理员级别')
      table.boolean('user_sex').comment('性别')
      table.bigInteger('birthday', 14).comment('生日')
      table.boolean('status', 1).defaultTo(0).comment('登录状态')
      table.integer('access_count', 6).defaultTo(0).comment('登录次数')
      table.text('auth').comment('分配权限')
      table.string('lastIp', 15).comment('最后登录IP')
      table.string('thisIp', 15).comment('本次登录IP')
      table.bigInteger('last_at', 13).comment('最后登录时间')
      table.bigInteger('this_at', 13).comment('本次登录时间')
      table.bigInteger('create_at', 13).comment('管理员创建时间')
    })
    .raw("ALTER TABLE `ni_admin_user` AUTO_INCREMENT=8985")

  }

  down() {
    this.drop('ni_admin_user')
  }
}

module.exports = UserSchema
