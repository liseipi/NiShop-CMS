'use strict'

const Schema = use('Schema')

class GoodsGallerySchema extends Schema {
  up () {
    this.create('ni_goods_galleries', (table) => {
      table.increments('ni_id')
      table.integer('goods_id', 16)
      table.string('depict', 255)
      table.integer('sort', 8)
      table.string('galleries_thumb', 64)
    })
  }

  down () {
    this.drop('ni_goods_galleries')
  }
}

module.exports = GoodsGallerySchema
