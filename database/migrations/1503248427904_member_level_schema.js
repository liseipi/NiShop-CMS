'use strict'

const Schema = use('Schema')

class MemberLevelSchema extends Schema {
  up () {
    this.create('ni_member_level', (table) => {
      table.increments('ni_id')
      table.string('level_name', 32).notNullable().comment('级别名称')
      table.integer('min_order', 8).notNullable().comment('当前级别最小订单数')
      table.integer('min_amount', 8).notNullable().comment('当前级别最小购物金额数')
      table.integer('min_points', 8).notNullable().comment('当前级别购物最小积分')
      table.text('level_note').comment('级别备注')
    })
  }

  down () {
    this.drop('ni_member_level')
  }
}

module.exports = MemberLevelSchema
