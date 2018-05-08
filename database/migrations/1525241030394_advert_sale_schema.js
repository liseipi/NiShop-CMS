'use strict'

const Schema = use('Schema')

class AdvertSaleSchema extends Schema {
  up () {
    this.create('ni_advert_sale', (table) => {
      table.increments('ni_id')
      table.string('sale_title', 255)
      table.integer('sale_start_time', 13)
      table.integer('sale_end_time', 13)
      table.integer('member_level', 2)
      table.integer('order_min_amount', 8)
      table.integer('status', 1).defaultTo(1)
      table.integer('sale_type', 2).comment('优惠方式')
      table.string('offerNote').comment('优惠备注')
      table.string('type_value1', 64).comment('赠品id')
      table.integer('type_value2', 8).comment('减免金额')
      table.integer('type_value3', 8).comment('折扣0.88')
      table.integer('sale_offerScope', 2).comment('优惠范围')
      table.integer('offerScope_value1', 8).comment('品牌id')
      table.integer('offerScope_value2', 2).comment('分类id')
      table.text('offerScope_value3').comment('优惠的商品')
      table.integer('create_at', 13).comment('促销创建时间')
    })
    .raw("ALTER TABLE `ni_advert_sale` AUTO_INCREMENT=25")
  }

  down () {
    this.drop('ni_advert_sale')
  }
}

module.exports = AdvertSaleSchema
