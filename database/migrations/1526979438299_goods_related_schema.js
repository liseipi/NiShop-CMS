'use strict'

const Schema = use('Schema')

class GoodsRelatedSchema extends Schema {
  up () {
    this.create('ni_goods_related', (table) => {
      table.increments('ni_id')
      table.string('attr_name', 8).comment('属性的名称如：选择，大小，颜色')
      table.text('goods_id').notNullable().comment('关联的商品ID')
    })
    .raw("ALTER TABLE `ni_goods_related` AUTO_INCREMENT=100")
  }

  down () {
    this.drop('ni_goods_related')
  }
}

module.exports = GoodsRelatedSchema
