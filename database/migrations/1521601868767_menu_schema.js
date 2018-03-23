'use strict'

const Schema = use('Schema')

class MenuSchema extends Schema {
  up () {
    this.create('ni_menus', (table) => {
      table.increments('ni_id')
      table.string('menuname', 32)
      table.integer('parent_id', 6)
      table.string('controller', 64)
      table.integer('runStatus', 1)
      table.integer('menu_sort', 6)
    })
  }

  down () {
    this.drop('ni_menus')
  }
}

module.exports = MenuSchema
