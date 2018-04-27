'use strict'

const Schema = use('Schema')

class ArticlesSchema extends Schema {
  up () {
    this.create('ni_articles', (table) => {
      table.increments('ni_id')
      table.integer('category_id', 6)
      table.string('article_title', 128)
      table.string('article_vice_title', 128)
      table.integer('article_author', 6)
      table.integer('status', 6)
      table.integer('sort', 6)
      table.integer('article_type', 6)
      table.string('thumb_img', 64)
      table.string('keywords', 128)
      table.string('summary_content', 255)
      table.text('content')
      table.integer('view_number', 128)
      table.bigInteger('create_at', 14)
      table.bigInteger('update_at', 14)
    })
    .raw("ALTER TABLE `ni_articles` AUTO_INCREMENT=6000")
  }

  down () {
    this.drop('ni_articles')
  }
}

module.exports = ArticlesSchema
