'use strict'

const Schema = use('Schema')

class TokensSchema extends Schema {
  up () {
    this.create('ni_admin_tokens', table => {
      table.increments('ni_id')
      table.integer('user_id').unsigned().references('ni_id').inTable('ni_admin_user')
      table.string('token', 40).notNullable().unique()
      table.string('type', 80).notNullable()
      table.boolean('is_revoked').defaultTo(false)
      table.timestamps()
    })
    .raw("ALTER TABLE `ni_admin_tokens` AUTO_INCREMENT=8000")
  }

  down () {
    this.drop('ni_admin_tokens')
  }
}

module.exports = TokensSchema
