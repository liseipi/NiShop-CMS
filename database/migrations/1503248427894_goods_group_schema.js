'use strict'

const Schema = use('Schema')

class GoodsGroupSchema extends Schema {
  up () {
    this.create('ni_goods_groups', (table) => {
      table.increments('ni_id')
      table.integer('goods_id', 8).notNullable().comment('商品ID')
      table.string('group_depict', 255).comment('组商品名称')
      table.float('group_price', 32).comment('价格')
      table.integer('group_instock', 32).comment('库存')
      table.string('group_thumb', 64).comment('缩略图')
      table.boolean('group_status', 1).comment('状态')
    })
    .raw("ALTER TABLE `ni_goods_groups` AUTO_INCREMENT=900")
  }

  down () {
    this.drop('ni_goods_groups')
  }
}

module.exports = GoodsGroupSchema
