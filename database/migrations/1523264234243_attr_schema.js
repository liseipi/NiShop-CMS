'use strict'

const Schema = use('Schema')

class AttrSchema extends Schema {
  up () {
    this.create('ni_attrs', (table) => {
      table.increments('ni_id')
      table.integer('brands_id', 8)
      table.integer('category_id', 8)
      table.string('attr_name', 32)
      table.integer('attr_only', 8)
      table.integer('attr_type', 8)
      table.text('attr_value')
    })
  }

  down () {
    this.drop('ni_attrs')
  }
}

module.exports = AttrSchema
