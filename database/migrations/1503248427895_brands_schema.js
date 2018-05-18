'use strict'

const Schema = use('Schema')

class BrandsSchema extends Schema {
  up () {
    this.create('ni_brands', (table) => {
      table.increments('ni_id')
      table.string('brands_name', 128).notNullable().comment('品牌名称')
      table.string('brands_link', 32).notNullable().comment('链接名')
      table.string('brands_logo', 64).comment('logo图片')
      table.string('brands_url', 255).comment('官网URL')
      table.string('brands_tel', 13).comment('服务电话')
      table.boolean('status', 1).comment('状态')
      table.integer('sort', 4).comment('排序')
      table.text('brands_desc').comment('描述')
      table.bigInteger('create_at', 13).comment('创建时间')
    })
    .raw("ALTER TABLE `ni_brands` AUTO_INCREMENT=700")
  }

  down () {
    this.drop('ni_brands')
  }
}

module.exports = BrandsSchema
