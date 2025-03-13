import { InferPageProps } from '@adonisjs/inertia/types'
import type LabelingController from '#labeler/controllers/labeling_controller'

import AppLayout from '#common/ui/components/app_layout'
import { Main } from '#common/ui/components/main'
import Heading from '#common/ui/components/heading'

export default function LabelingPage({
  files,
  labeledFiles,
}: InferPageProps<LabelingController, 'index'>) {
  return (
    <AppLayout breadcrumbs={[{ label: 'Labeling' }]}>
      <Main>
        <Heading
          title="Listagem de Arquivos JSON"
          description="Selecione um arquivo para rotular."
        />

        <ul className="list-disc pl-5">
          {files.map((file: string) => (
            <li key={file} className="py-2">
              <a href={`/label/${file}`} className="text-blue-500 underline hover:text-blue-700">
                {file}
              </a>

              {labeledFiles[file] && (
                <span className="ml-4 text-gray-600">
                  — <strong>Correto?</strong> {labeledFiles[file].isCorrect ? 'Sim' : 'Não'}
                  <strong> Obs:</strong> {labeledFiles[file].observation}
                </span>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-6">
          <a href="/logout" className="text-red-500 underline hover:text-red-700">
            Logout
          </a>
        </p>
      </Main>
    </AppLayout>
  )
}
