'use strict'

const Schema = use('Schema')

class AdvertSchema extends Schema {
  up () {
    this.create('ni_adverts', (table) => {
      table.increments('ni_id')
      table.string('ad_name', 255)
      table.text('ad_describe')
      table.integer('ad_type', 1)
      table.integer('ad_status', 1)
      table.string('ad_url', 255)
    })
  }

  down () {
    this.drop('ni_adverts')
  }
}

module.exports = AdvertSchema
