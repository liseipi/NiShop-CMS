'use strict'

const Schema = use('Schema')

class GoodsGroupSchema extends Schema {
  up () {
    this.create('ni_goods_groups', (table) => {
      table.increments('ni_id')
      table.string('goods_id', 12)
      table.string('goods_depict', 255)
      table.string('goods_price', 32)
      table.string('goods_instock', 32)
      table.string('goods_thumb', 64)
      table.integer('group_status', 1)
    })
  }

  down () {
    this.drop('ni_goods_groups')
  }
}

module.exports = GoodsGroupSchema
