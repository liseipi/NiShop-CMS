'use strict'

const Schema = use('Schema')

class AdvertGallerySchema extends Schema {
  up () {
    this.create('ni_advert_galleries', (table) => {
      table.increments('ni_id')
      table.integer('advert_id', 8)
      table.string('advert_images', 32)
      table.string('pic_type', 1)
      table.string('advert_url', 255)
      table.text('advert_describe')
      table.integer('advert_sort', 8)
    })
    .raw("ALTER TABLE `ni_advert_galleries` AUTO_INCREMENT=2000")
  }

  down () {
    this.drop('ni_advert_galleries')
  }
}

module.exports = AdvertGallerySchema
