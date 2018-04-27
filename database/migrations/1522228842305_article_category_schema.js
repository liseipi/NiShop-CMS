'use strict'

const Schema = use('Schema')

class ArticleCategorySchema extends Schema {
  up () {
    this.create('ni_article_categories', (table) => {
      table.increments('ni_id')
      table.string('column_name', 16)
      table.integer('parent_id', 6)
      table.text('column_desc')
      table.integer('column_sort', 6)
      table.integer('column_status', 1)
      table.integer('column_type', 1)
      table.string('controller', 64)
    })
    .raw("ALTER TABLE `ni_article_categories` AUTO_INCREMENT=1000")
  }

  down () {
    this.drop('ni_article_categories')
  }
}

module.exports = ArticleCategorySchema
