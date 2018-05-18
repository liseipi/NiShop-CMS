'use strict'

const Schema = use('Schema')
const Database = use('Database')

class ArticleCategorySchema extends Schema {
  up () {
    this.create('ni_article_categories', (table) => {
      table.increments('ni_id')
      table.string('column_name', 16).notNullable().comment('栏目名称')
      table.integer('parent_id', 6).notNullable().comment('父级ID')
      table.string('controller', 64).comment('控制器')
      table.text('column_desc').comment('描述')
      table.integer('column_sort', 4).comment('排序')
      table.boolean('column_status', 1).comment('状态')
      table.integer('column_type', 2).comment('类型')
    })
    .raw("ALTER TABLE `ni_article_categories` AUTO_INCREMENT=1000")

    this.schedule(async (trx) => {
      let rows = [
        {column_name: '行业动态', parent_id: 0},
        {column_name: '企业新闻', parent_id: 0}
      ]
      await Database.table('ni_article_categories').transacting(trx).insert(rows)
    })

  }

  down () {
    this.drop('ni_article_categories')
  }
}

module.exports = ArticleCategorySchema
