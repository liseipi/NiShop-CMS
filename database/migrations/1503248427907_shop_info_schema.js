'use strict'

const Schema = use('Schema')

class ShopInfoSchema extends Schema {
  up () {
    this.create('ni_shop_info', (table) => {
      table.increments('ni_id')
      table.string('shop_name', 255).comment('商店名称')
      table.string('shop_title', 255).comment('页面Title')
      table.string('shop_keyword', 255).comment('页面关键字')
      table.string('shop_tel', 12).comment('商店电话')
      table.string('shop_icp', 255).comment('网站ICP')
      table.string('logo', 32).comment('商店logo')
      table.text('introduction').comment('简介')
    })
  }

  down () {
    this.drop('ni_shop_info')
  }
}

module.exports = ShopInfoSchema
