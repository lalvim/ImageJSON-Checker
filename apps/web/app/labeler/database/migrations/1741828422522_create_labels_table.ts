import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Labels extends BaseSchema {
  protected tableName = 'labels'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('file_name').notNullable()
      table.boolean('is_correct').defaultTo(false)
      table.text('observation').nullable()

      // Cria as colunas created_at e updated_at automaticamente
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
