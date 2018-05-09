'use strict'

const Schema = use('Schema')

class GoodsGroupSchema extends Schema {
  up () {
    this.create('ni_goods_groups', (table) => {
      table.increments('ni_id')
      table.integer('goods_id', 12)
      table.string('group_depict', 255)
      table.float('group_price', 32)
      table.integer('group_instock', 32)
      table.string('group_thumb', 64)
      table.integer('group_status', 1)
    })
    .raw("ALTER TABLE `ni_goods_groups` AUTO_INCREMENT=900")
  }

  down () {
    this.drop('ni_goods_groups')
  }
}

module.exports = GoodsGroupSchema
