'use strict'

const Schema = use('Schema')

class GoodsAttrSchema extends Schema {
  up () {
    this.create('ni_goods_attrs', (table) => {
      table.increments('ni_id')
      table.integer('goods_id', 8)
      table.integer('attr_id', 8)
      table.string('goods_attr_value', 255)
    })
    .raw("ALTER TABLE `ni_goods_attrs` AUTO_INCREMENT=1100")
  }

  down () {
    this.drop('ni_goods_attrs')
  }
}

module.exports = GoodsAttrSchema
