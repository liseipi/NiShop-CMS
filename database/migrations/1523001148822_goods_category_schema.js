'use strict'

const Schema = use('Schema')

class GoodsCategorySchema extends Schema {
  up () {
    this.create('ni_goods_categories', (table) => {
      table.increments('ni_id')
      table.string('column_name', 16)
      table.integer('parent_id', 6)
      table.string('column_sku', 24)
      table.text('column_keywords', 255)
      table.text('column_desc')
      table.integer('column_sort', 6)
      table.integer('column_status', 1)
      table.integer('column_type', 1)
      table.string('controller', 64)
    })
    .raw("ALTER TABLE `ni_goods_categories` AUTO_INCREMENT=2000")
  }

  down () {
    this.drop('ni_goods_categories')
  }
}

module.exports = GoodsCategorySchema
