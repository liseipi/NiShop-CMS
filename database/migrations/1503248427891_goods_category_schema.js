'use strict'

const Schema = use('Schema')
const Database = use('Database')

class GoodsCategorySchema extends Schema {
  up () {
    this.create('ni_goods_categories', (table) => {
      table.increments('ni_id')
      table.string('column_name', 16).notNullable().comment('栏目名称')
      table.integer('parent_id', 6).notNullable().comment('父级ID')
      table.string('column_sku', 24).notNullable().comment('栏目SKU')
      table.string('controller', 64).comment('控制器')
      table.text('column_keywords', 255).comment('关键字')
      table.text('column_desc').comment('描述')
      table.integer('column_sort', 6).comment('排序')
      table.boolean('column_status', 1).comment('状态')
      table.integer('column_type', 1).comment('类型')
    })
    .raw("ALTER TABLE `ni_goods_categories` AUTO_INCREMENT=2000")

    this.schedule(async (trx) => {
      let rows = [
        {column_name: '测试栏目', parent_id: 0}
      ]
      await Database.table('ni_goods_categories').transacting(trx).insert(rows)
    })

  }

  down () {
    this.drop('ni_goods_categories')
  }
}

module.exports = GoodsCategorySchema
