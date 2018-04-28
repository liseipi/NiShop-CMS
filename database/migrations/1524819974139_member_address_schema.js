'use strict'

const Schema = use('Schema')

class MemberAddressSchema extends Schema {
  up () {
    this.create('ni_member_address', (table) => {
      table.increments('ni_id')
      table.integer('member_id', 10)
      table.boolean('default').defaultTo(false)
      table.string('username', 16)
      table.integer('region_a', 8).defaultTo(0)
      table.integer('region_b', 8).defaultTo(0)
      table.integer('region_c', 8).defaultTo(0)
      table.integer('region_d', 8).defaultTo(0)
      table.string('address', 32)
      table.string('mobile', 12)
    })
    .raw("ALTER TABLE `ni_member_address` AUTO_INCREMENT=3000")
  }

  down () {
    this.drop('ni_member_address')
  }
}

module.exports = MemberAddressSchema
