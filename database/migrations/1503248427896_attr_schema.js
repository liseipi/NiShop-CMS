'use strict'

const Schema = use('Schema')

class AttrSchema extends Schema {
  up () {
    this.create('ni_attrs', (table) => {
      table.increments('ni_id')
      table.integer('brands_id', 8).notNullable().comment('品牌ID')
      table.integer('category_id', 8).notNullable().comment('分类ID')
      table.string('attr_name', 32).notNullable().comment('属性名称')
      table.integer('attr_only', 8).comment('唯一性')
      table.integer('attr_type', 8).notNullable().comment('类型')
      table.text('attr_value').comment('属性可选值')
    })
    .raw("ALTER TABLE `ni_attrs` AUTO_INCREMENT=500")
  }

  down () {
    this.drop('ni_attrs')
  }
}

module.exports = AttrSchema
