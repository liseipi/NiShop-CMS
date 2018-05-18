'use strict'

const Schema = use('Schema')

class ArticlesSchema extends Schema {
  up () {
    this.create('ni_articles', (table) => {
      table.increments('ni_id')
      table.integer('category_id', 6).notNullable().comment('栏目ID')
      table.string('article_title', 128).notNullable().comment('文章标题')
      table.string('article_vice_title', 128).comment('文章副标题')
      table.string('article_author', 32).comment('文章作者')
      table.boolean('status', 1).defaultTo(0).comment('状态')
      table.integer('sort', 4).comment('排序')
      table.integer('article_type', 2).comment('文章类型')
      table.string('thumb_img', 64).comment('缩略图片')
      table.string('keywords', 128).comment('关键字')
      table.text('summary_content', 255).comment('概要')
      table.text('content').comment('正文内容')
      table.integer('view_count', 128).defaultTo(0).comment('查看次数')
      table.bigInteger('update_at', 13).comment('上次修改时间')
      table.bigInteger('create_at', 13).comment('文章发表时间')
    })
    .raw("ALTER TABLE `ni_articles` AUTO_INCREMENT=6000")
  }

  down () {
    this.drop('ni_articles')
  }
}

module.exports = ArticlesSchema
