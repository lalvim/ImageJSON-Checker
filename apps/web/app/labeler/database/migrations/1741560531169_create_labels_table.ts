import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Labels extends BaseSchema {
  protected tableName = 'labels'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
      table.string('file_name').notNullable()
      table.boolean('is_correct').defaultTo(false)
      table.text('observation').nullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
  
  async down() {
    this.schema.dropTable(this.tableName)
  }
}