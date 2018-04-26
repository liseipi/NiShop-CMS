'use strict'

const Schema = use('Schema')

class ShopInfoSchema extends Schema {
  up () {
    this.create('ni_shop_info', (table) => {
      table.increments('ni_id')
      table.string('shop_name', 255)
      table.string('shop_title', 255)
      table.string('shop_keyword', 255)
      table.string('shop_tel', 12)
      table.string('shop_icp', 255)
      table.string('logo', 32)
      table.text('introduction')
    })
  }

  down () {
    this.drop('ni_shop_info')
  }
}

module.exports = ShopInfoSchema
