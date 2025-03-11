import type { HttpContext } from '@adonisjs/core/http'

import { createLabelValidator } from '#labeler/validators'

import fs from 'fs'
import path from 'path'
import Label from '#labeler/models/label'
import app from '@adonisjs/core/services/app'

export default class LabelingController {
  /**
   * Lista todos os arquivos JSON disponíveis e exibe quais já foram rotulados pelo usuário atual.
   */
  public async index({ auth, inertia }: HttpContext) {
    // Diretório onde os JSONs estão armazenados
    const jsonDir = app.makePath('jsons')

    // Obtém a lista de arquivos JSON disponíveis no diretório
    const files = fs.readdirSync(jsonDir).filter((file) => file.endsWith('.json'))

    // Obtém os rótulos já feitos pelo usuário logado
    const userId = auth.user?.id
    const labels = await Label.query().where('user_id', userId!)

    // Converte a lista de rótulos em um objeto mapeado
    const labeledFiles: Record<string, { isCorrect: boolean; observation: string }> = labels.reduce(
      (acc, label) => {
        acc[label.fileName] = {
          isCorrect: label.isCorrect,
          observation: label.observation ?? '',
        }
        return acc
      },
      {} as Record<string, { isCorrect: boolean; observation: string }>
    )

    // Renderiza a página React via Inertia
    return inertia.render('labeler/ui/pages/index', { files, labeledFiles })
  }
  /**
   * Mostra detalhes de um determinado JSON e a imagem correspondente.
   * Exemplo de rota: GET /label/:filename
   */
  public async show({ params, auth, inertia }: HttpContext) {
    const fileName = params.filename

    // Diretório onde estão os JSONs
    const jsonDir = app.makePath('jsons')
    const filePath = path.join(jsonDir, fileName)

    if (!fs.existsSync(filePath)) {
      return inertia.render('error', { message: 'Arquivo JSON não encontrado.' })
    }

    // Lê o JSON
    const rawData = fs.readFileSync(filePath, 'utf-8')
    const jsonData = JSON.parse(rawData)

    // Nome da imagem correspondente ao JSON
    const imageName = fileName.replace('.json', '.png')

    // Verifica se já existe uma rotulação salva
    const userId = auth.user?.id
    const existingLabel = await Label.query()
      .where('user_id', userId!)
      .where('file_name', fileName)
      .first()

    return inertia.render('labeler/ui/pages/show', {
      fileName,
      jsonData,
      imageName,
      existingLabel: existingLabel
        ? { isCorrect: existingLabel.isCorrect, observation: existingLabel.observation }
        : null,
    })
  }  

  public async store({ request, auth, response, inertia }: HttpContext) {
    
    const userId = auth.user?.id
    
    if (!userId) {
      return response.redirect().toPath('/login') 
    }
    // Validação dos dados recebidos
    const { fileName, isCorrect, observation } = await request.validateUsing(createLabelValidator)
    
    // Verifica se já existe um Label para esse usuário e esse arquivo
    let label = await Label.query().where('user_id', userId).where('file_name', fileName).first()

    if (!label) {
        label = new Label()
        label.userId = userId
        label.fileName = fileName
    }

    // Converte isCorrect para boolean
    label.isCorrect = Boolean(isCorrect)
    label.observation = observation || null

    await label.save()

    // Redireciona para a listagem de rótulos no Inertia
    return inertia.location('/labels')
  }
}
