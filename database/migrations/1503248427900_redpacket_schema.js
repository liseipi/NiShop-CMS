'use strict'

const Schema = use('Schema')

class RedpacketSchema extends Schema {
  up () {
    this.create('ni_redpacket', (table) => {
      table.increments('ni_id')
      table.string('redpacket_name', 255).notNullable().comment('红包名称')
      table.float('redpacket_price', 8).notNullable().comment('红包金额')
      table.float('redpacket_min_order_price', 8).notNullable().comment('最小订单金额')
      table.boolean('status', 1).defaultTo(1).comment('状态')
      table.boolean('emit_status', 1).defaultTo(1).comment('邮件发送状态')
      table.integer('redpacket_type', 2).notNullable().comment('红包类型')
      table.bigInteger('redpacket_push_start_at', 13).comment('红包发放开始时间')
      table.bigInteger('redpacket_push_end_at', 13).comment('红包发放结束时间')
      table.bigInteger('redpacket_use_start_at', 13).comment('红包使用开始时间')
      table.bigInteger('redpacket_use_end_at', 13).comment('红包使用结束时间')
      table.bigInteger('create_at', 13).comment('红包创建时间')
    })
    .raw("ALTER TABLE `ni_redpacket` AUTO_INCREMENT=888")
  }

  down () {
    this.drop('ni_redpacket')
  }
}

module.exports = RedpacketSchema
