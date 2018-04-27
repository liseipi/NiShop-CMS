'use strict'

const Schema = use('Schema')

class BrandsSchema extends Schema {
  up () {
    this.create('ni_brands', (table) => {
      table.increments('ni_id')
      table.string('brands_name', '128')
      table.string('brands_link', '32')
      table.string('brands_logo', '32')
      table.string('brands_url', '128')
      table.string('brands_tel', '12')
      table.integer('status', 1)
      table.integer('sort', 10)
      table.text('brands_desc')
    })
    .raw("ALTER TABLE `ni_brands` AUTO_INCREMENT=700")
  }

  down () {
    this.drop('ni_brands')
  }
}

module.exports = BrandsSchema
