import { FormEvent, useState } from 'react'
import { Inertia } from '@inertiajs/inertia'
import { ShowLabelProps } from '#labeler/types/label'

import AppLayout from '#common/ui/components/app_layout'
import { Main } from '#common/ui/components/main'
import Heading from '#common/ui/components/heading'


  export default function ShowLabel({
    fileName,
    jsonData,
    imageName,
    existingLabel,
  }: ShowLabelProps) {
    const [isCorrect, setIsCorrect] = useState(existingLabel?.isCorrect ?? false)
    const [observation, setObservation] = useState(existingLabel?.observation ?? '')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    Inertia.post('/labels', { fileName, isCorrect, observation })
  }

  return (
    <AppLayout breadcrumbs={[{ label: 'Labeling', href: '/labels' }, { label: fileName }]}>
      <Main>
        <Heading title={`Arquivo: ${fileName}`} description="Visualize e rotule o JSON associado." />

        <div className="mt-4">
          <h2 className="text-lg font-semibold">Conteúdo do JSON</h2>
          <pre className="bg-gray-200 p-4 rounded-md text-sm overflow-auto">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Imagem</h2>
          <img src={`/images/${imageName}`} alt="Imagem associada" className="w-80 h-auto mt-2" />
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Rotular</h2>
          <form onSubmit={handleSubmit} className="mt-4">
            <input type="hidden" name="fileName" value={fileName} />

            <div className="mb-4">
              <label className="mr-4">
                <input
                  type="radio"
                  name="isCorrect"
                  value="true"
                  checked={isCorrect}
                  onChange={() => setIsCorrect(true)}
                  className="mr-1"
                />
                Verdadeiro
              </label>
              <label>
                <input
                  type="radio"
                  name="isCorrect"
                  value="false"
                  checked={!isCorrect}
                  onChange={() => setIsCorrect(false)}
                  className="mr-1"
                />
                Falso
              </label>
            </div>

            <div className="mb-4">
              <label htmlFor="observation" className="block text-sm font-medium">
                Observação
              </label>
              <textarea
                id="observation"
                name="observation"
                rows={3}
                cols={50}
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Salvar
            </button>
          </form>
        </div>

        <p className="mt-6">
          <a href="/labels" className="text-blue-500 underline hover:text-blue-700">
            Voltar
          </a>
        </p>
      </Main>
    </AppLayout>
  )
}
