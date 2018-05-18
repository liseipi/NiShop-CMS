'use strict'

const Schema = use('Schema')
const Database = use('Database')

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

    this.schedule(async (trx) => {
      await Database.table('ni_admin_user').transacting(trx).insert({
        username: 'oli.liu',
        email: 'oli@qq.com',
        password: '$2a$10$AgQC6LdhSgienEDIdeO6We3NHkOfcEpv/ITeT6cdnHPBlV3mZc31m',
        status: 1,
        auth:'450,451,452,453,454,455,456,457,458',
        create_at: new Date().getTime()
      })
    })
  }

  down() {
    this.drop('ni_admin_user')
  }
}

module.exports = UserSchema
