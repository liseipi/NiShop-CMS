'use strict'

const Schema = use('Schema')

class MemberCartSchema extends Schema {
  up () {
    this.create('ni_member_cart', (table) => {
      table.increments('ni_id')
      table.integer('member_id', 8)
      table.integer('goods_id', 8)
      table.integer('quantity', 4).defaultTo(0)
      table.boolean('goods_is_group').defaultTo(false)
      table.integer('group_id', 8)
      table.timestamp('create_at').comment('加入时间')
    })
  }

  down () {
    this.drop('ni_member_cart')
  }
}

module.exports = MemberCartSchema
