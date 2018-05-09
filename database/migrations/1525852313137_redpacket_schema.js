'use strict'

const Schema = use('Schema')

class RedpacketSchema extends Schema {
  up () {
    this.create('ni_redpacket', (table) => {
      table.increments('ni_id')
      table.string('redpacket_name', 255)
      table.float('redpacket_price', 8)
      table.float('redpacket_min_order_price', 8)
      table.integer('status', 2).defaultTo(1)
      table.integer('redpacket_type', 2)
      table.bigInteger('redpacket_push_start_at', 13)
      table.bigInteger('redpacket_push_end_at', 13)
      table.bigInteger('redpacket_use_start_at', 13)
      table.bigInteger('redpacket_use_end_at', 13)
    })
  }

  down () {
    this.drop('ni_redpacket')
  }
}

module.exports = RedpacketSchema
