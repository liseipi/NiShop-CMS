'use strict'

const Schema = use('Schema')

class GoodsGallerySchema extends Schema {
  up () {
    this.create('ni_goods_galleries', (table) => {
      table.increments('ni_id')
      table.integer('goods_id', 8).notNullable().comment('商品ID')
      table.string('gallery_depict', 255).comment('描述')
      table.integer('gallery_sort', 4).comment('排序')
      table.string('gallery_thumb', 64).comment('缩略图')
    })
    .raw("ALTER TABLE `ni_goods_galleries` AUTO_INCREMENT=1200")
  }

  down () {
    this.drop('ni_goods_galleries')
  }
}

module.exports = GoodsGallerySchema
