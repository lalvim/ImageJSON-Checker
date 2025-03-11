import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { belongsTo, column, computed, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Label from '#labeler/models/label' 

import { attachment, attachmentManager } from '@jrmc/adonis-attachment'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'

import BaseModel from '#common/models/base_model'
import Role from '#users/models/role'

import Roles from '#users/enums/role'
import ResetPasswordToken from '#users/models/reset_password_token'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleId: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string | null

  @attachment({ preComputeUrl: false })
  declare avatar: Attachment

  @column()
  declare avatarUrl: string | null

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @hasMany(() => ResetPasswordToken)
  declare resetPasswordTokens: HasMany<typeof ResetPasswordToken>

  @hasMany(() => Label)
  declare labels: HasMany<typeof Label>

  @computed()
  get isAdmin() {
    return this.roleId === Roles.ADMIN
  }

  static async preComputeUrls(models: User | User[]) {
    if (Array.isArray(models)) {
      await Promise.all(models.map((model) => this.preComputeUrls(model)))
      return
    }

    if (!models.avatar) {
      return
    }

    await attachmentManager.computeUrl(models.avatar)
  }
}
