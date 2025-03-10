import type { HttpContext } from '@adonisjs/core/http'

import fs from 'fs'
import path from 'path'
import Label from '#labeler/models/label'
import app from '@adonisjs/core/services/app'

export default class LabelingController {
  /**
   * Lista todos os arquivos JSON disponíveis e exibe quais já foram rotulados pelo usuário atual.
   */
  public async index({ auth, view }: HttpContext) {
    // Diretório de JSON
    const jsonDir = app.makePath('#jsons')

    // Pega todos os arquivos .json do diretório
    const files = fs.readdirSync(jsonDir).filter((file) => file.endsWith('.json'))

    // Busca rótulos já feitos pelo usuário logado
    const userId = auth.user?.id
    const labels = await Label.query().where('user_id', userId!)

    // Cria um map para saber quais arquivos o usuário já rotulou
    const labeledFiles = labels.reduce((acc: Record<string, { isCorrect: boolean; observation: string }>, label) => {
      acc[label.fileName] = { isCorrect: label.isCorrect, observation: label.observation ?? '' }
      return acc
    }, {})

    return view.render('labeler/ui/pages/index', { files, labeledFiles })
  }

  /**
   * Mostra detalhes de um determinado JSON e a imagem correspondente.
   * Exemplo de rota: GET /label/:filename
   */
  public async show({ params, auth, view }: HttpContext) {
    const fileName = params.filename

    // Lê o conteúdo JSON
    const jsonDir = app.makePath('#jsons')
    const filePath = path.join(jsonDir, fileName)

    if (!fs.existsSync(filePath)) {
      return 'Arquivo JSON não encontrado.'
    }

    const rawData = fs.readFileSync(filePath, 'utf-8')
    const jsonData = JSON.parse(rawData)

    // Caso imagem tenha a mesma “raiz” do arquivo JSON,
    // troque a extensão .json para .jpg, .png ou similar.
    // Aqui vamos simplesmente trocar .json -> .jpg
    // Ajuste conforme seu caso real.
    const imageName = fileName.replace('.json', '.jpg')

    // Verifica se o usuário já rotulou
    const userId = auth.user?.id
    const existingLabel = await Label.query()
      .where('user_id', userId!)
      .where('file_name', fileName)
      .first()

    return view.render('labeler/ui/pages/show', {
      fileName,
      jsonData,
      imageName,
      existingLabel,
    })
  }

  /**
   * Salva (ou atualiza) a anotação do usuário (POST).
   */
  public async store({ request, auth, response }: HttpContext) {
    const userId = auth.user?.id
    const { fileName, isCorrect, observation } = request.all()

    // Verifica se já existe um Label para esse usuário e esse arquivo
    let label = await Label.query()
      .where('user_id', userId!)
      .where('file_name', fileName)
      .first()

    if (!label) {
      label = new Label()
      label.userId = userId!
      label.fileName = fileName
    }

    label.isCorrect = isCorrect === 'true'
    label.observation = observation || null

    await label.save()

    // Redireciona de volta para a listagem ou para outra rota
    return response.redirect().toPath('/labels')
  }
}
