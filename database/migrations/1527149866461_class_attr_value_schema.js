'use strict'

const Schema = use('Schema')

class ClassAttrValueSchema extends Schema {
  up () {
    this.create('ni_class_attr_values', (table) => {
      table.increments('ni_id')
      table.integer('category_id', 8).notNullable().comment('分类ID')
      table.integer('class_attr_id', 8).notNullable().comment('主要属性ID')
      table.string('class_attr_value', 64).notNullable().comment('分类属性值')
      table.string('class_value_alias', 64).comment('分类属性值别名')
      table.boolean('class_is_show').comment('是否在分类栏目展示')
    })
  }

  down () {
    this.drop('ni_class_attr_values')
  }
}

module.exports = ClassAttrValueSchema
