'use strict'

const Schema = use('Schema')

class RedpacketLibrarySchema extends Schema {
  up () {
    this.create('ni_redpacket_library', (table) => {
      table.increments('ni_id')
      table.integer('redpacket_id', 8).notNullable().comment('对应红包')
      table.integer('redpacket_type', 2).notNullable().comment('对应类型')
      table.integer('member_level_id', 8).comment('会员级别ID')
      table.integer('brands_id', 8).comment('品牌ID')
      table.integer('category_id', 8).comment('分类ID')
      table.float('order_amount').comment('订单金额')
      table.string('coupon', 13).comment('优惠券')
      table.integer('member_id', 8).comment('会员ID')
      table.integer('goods_id', 8).comment('商品ID')
      table.integer('order_id', 8).comment('订单ID')
      table.integer('use_member_id', 8).comment('使用会员ID')
      table.bigInteger('use_at', 13).comment('使用时间')
    })
  }

  down () {
    this.drop('ni_redpacket_library')
  }
}

module.exports = RedpacketLibrarySchema
