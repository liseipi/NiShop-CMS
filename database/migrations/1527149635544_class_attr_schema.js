'use strict'

const Schema = use('Schema')

class ClassAttrSchema extends Schema {
  up () {
    this.create('ni_class_attr', (table) => {
      table.increments('ni_id')
      table.integer('category_id', 8).notNullable().comment('分类ID')
      table.string('attr_name', 64).notNullable().comment('主要属性名称')
    })
  }

  down () {
    this.drop('ni_class_attr')
  }
}

module.exports = ClassAttrSchema
