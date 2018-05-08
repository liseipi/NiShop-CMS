'use strict'

const Schema = use('Schema')

class MemberLevelSchema extends Schema {
  up () {
    this.create('ni_member_level', (table) => {
      table.increments('ni_id')
      table.string('level_name', 32)
      table.integer('min_order', 8)
      table.integer('min_amount', 8)
      table.integer('min_points', 8)
      table.text('level_note')
    })
  }

  down () {
    this.drop('ni_member_level')
  }
}

module.exports = MemberLevelSchema
