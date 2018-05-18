'use strict'

const Schema = use('Schema')

class MemberCartSchema extends Schema {
  up () {
    this.create('ni_member_cart', (table) => {
      table.increments('ni_id')
      table.integer('member_id', 8).notNullable().comment('会员ID')
      table.integer('goods_id', 8).notNullable().comment('商品ID')
      table.boolean('is_select', 1).defaultTo(0).comment('是否选中')
      table.integer('quantity', 4).defaultTo(1).comment('数量')
      table.boolean('goods_is_group').defaultTo(false).comment('是否为组商品')
      table.integer('group_id', 8).comment('组ID')
      table.bigInteger('create_at').comment('加入时间')
    })
  }

  down () {
    this.drop('ni_member_cart')
  }
}

module.exports = MemberCartSchema
