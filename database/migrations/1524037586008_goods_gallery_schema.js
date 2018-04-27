'use strict'

const Schema = use('Schema')

class GoodsGallerySchema extends Schema {
  up () {
    this.create('ni_goods_galleries', (table) => {
      table.increments('ni_id')
      table.integer('goods_id', 16)
      table.string('gallery_depict', 255)
      table.integer('gallery_sort', 8)
      table.string('gallery_thumb', 64)
    })
    .raw("ALTER TABLE `ni_goods_galleries` AUTO_INCREMENT=1200")
  }

  down () {
    this.drop('ni_goods_galleries')
  }
}

module.exports = GoodsGallerySchema
