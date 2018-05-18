'use strict'

const Schema = use('Schema')

class AdvertGallerySchema extends Schema {
  up () {
    this.create('ni_advert_galleries', (table) => {
      table.increments('ni_id')
      table.integer('advert_id', 4).notNullable().comment('广告ID')
      table.string('advert_images', 32).comment('广告图片')
      table.string('pic_type', 1).notNullable().comment('图片类型，指定的位置')
      table.string('advert_url', 255).comment('广告链接')
      table.text('advert_describe').comment('描述')
      table.integer('advert_sort', 4).comment('排序')
    })
    .raw("ALTER TABLE `ni_advert_galleries` AUTO_INCREMENT=2000")
  }

  down () {
    this.drop('ni_advert_galleries')
  }
}

module.exports = AdvertGallerySchema
