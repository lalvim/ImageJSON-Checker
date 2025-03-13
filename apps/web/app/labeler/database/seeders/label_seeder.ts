import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Label from '#labeler/models/label'

export default class LabelSeeder extends BaseSeeder {
  public async run() {
    // Crie alguns registros de exemplo para a tabela "labels".
    // Atenção: Certifique-se que os IDs de usuário (userId) existem na tabela "users",
    // pois há uma restrição de chave estrangeira.
    await Label.createMany([
      {
        userId: 1,
        fileName: 'aeroporto_RJ_1.json',
        isCorrect: true,
        observation: 'Primeiro label de exemplo',
      },
    ])
  }
}
