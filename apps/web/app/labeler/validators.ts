import vine from '@vinejs/vine'
import Label from '#labeler/models/label'

/**
 * Validação ao criar/atualizar um rótulo
 */
export const createLabelValidator = vine.compile(
  vine.object({
    fileName: vine.string().trim().minLength(3).maxLength(255),
    isCorrect: vine.boolean(),
    observation: vine.string().trim().maxLength(500).optional(),
  })
)

/**
 * Validação ao atualizar um rótulo (edit)
 */
export const editLabelValidator = vine.withMetaData<{ userId: number }>().compile(
  vine.object({
    fileName: vine.string().trim().minLength(3).maxLength(255),
    isCorrect: vine.boolean(),
    observation: vine.string().trim().maxLength(500).optional(),
  })
)

/**
 * Validação para checar se um rótulo já existe
 */
export const checkLabelExistsValidator = vine.withMetaData<{ userId: number }>().compile(
  vine.object({
    fileName: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(255)
      .unique(async (_, value, field) => {
        const row = await Label.query()
          .where('file_name', value)
          .where('user_id', field.meta.userId)
          .first()
        return !row
      }),
  })
)
