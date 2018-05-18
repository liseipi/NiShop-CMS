'use strict'

const Schema = use('Schema')

class AdvertSaleSchema extends Schema {
  up () {
    this.create('ni_advert_sale', (table) => {
      table.increments('ni_id')
      table.string('sale_title', 255).notNullable().comment('活动标题')
      table.bigInteger('sale_start_time', 13).notNullable().comment('开始时间')
      table.bigInteger('sale_end_time', 13).notNullable().comment('结束时间')
      table.integer('member_level', 2).comment('会员级别享受优惠')
      table.float('order_min_amount', 8).comment('最小订单金额享受优惠')
      table.boolean('status', 1).defaultTo(1).comment('状态')
      table.integer('sale_type', 2).notNullable().comment('优惠方式')
      table.string('offerNote').comment('优惠备注')
      table.string('type_value1', 64).comment('赠品id')
      table.float('type_value2', 8).comment('减免金额')
      table.float('type_value3').comment('折扣0.88')
      table.integer('sale_offerScope', 2).notNullable().comment('优惠范围')
      table.integer('offerScope_value1', 8).comment('品牌id')
      table.integer('offerScope_value2', 2).comment('分类id')
      table.text('offerScope_value3').comment('优惠的商品')
      table.bigInteger('create_at', 13).comment('促销创建时间')
    })
    .raw("ALTER TABLE `ni_advert_sale` AUTO_INCREMENT=25")
  }

  down () {
    this.drop('ni_advert_sale')
  }
}

module.exports = AdvertSaleSchema
