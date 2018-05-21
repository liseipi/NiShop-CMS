'use strict'

const Schema = use('Schema')
const Database = use('Database')

class NiRegionSchema extends Schema {
  up () {
    this.create('ni_region', (table) => {
      table.increments('ni_id')
      table.string('region_name', 32)
      table.integer('parent_id', 16)
      table.integer('region_type', 8)
    })
  }

  down () {
    this.drop('ni_region')
  }
}

module.exports = NiRegionSchema
