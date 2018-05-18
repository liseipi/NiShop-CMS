'use strict'

const Schema = use('Schema')

class AdvertSchema extends Schema {
  up () {
    this.create('ni_adverts', (table) => {
      table.increments('ni_id')
      table.string('ad_name', 255).notNullable().comment('广告名称')
      table.text('ad_describe').comment('描述')
      table.integer('ad_type', 1).notNullable().comment('类型')
      table.boolean('ad_status', 1).comment('状态')
      table.string('ad_url', 255).comment('链接')
    })
    .raw("ALTER TABLE `ni_adverts` AUTO_INCREMENT=300")
  }

  down () {
    this.drop('ni_adverts')
  }
}

module.exports = AdvertSchema
