'use strict'

const Schema = use('Schema')

class MemberAddressSchema extends Schema {
  up () {
    this.create('ni_member_address', (table) => {
      table.increments('ni_id')
      table.integer('member_id', 10).notNullable().comment('会员ID')
      table.boolean('default').defaultTo(false).comment('默认地址')
      table.string('username', 16).notNullable().comment('收货人名称')
      table.integer('region_a', 8).notNullable().defaultTo(0).comment('省市')
      table.integer('region_b', 8).notNullable().defaultTo(0).comment('市区')
      table.integer('region_c', 8).notNullable().defaultTo(0).comment('乡镇')
      table.integer('region_d', 8).defaultTo(0).comment('街道')
      table.string('address', 32).notNullable().comment('详细地址')
      table.string('mobile', 12).notNullable().comment('联系手机')
      table.string('email', 64).comment('邮箱')
      table.string('send_zip', 64).comment('邮编')
      table.bigInteger('create_at', 13).comment('地址创建时间')
    })
    .raw("ALTER TABLE `ni_member_address` AUTO_INCREMENT=3000")
  }

  down () {
    this.drop('ni_member_address')
  }
}

module.exports = MemberAddressSchema
