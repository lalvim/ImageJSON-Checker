import { BaseMail } from '@adonisjs/mail'
import env from '#start/env'
import router from '@adonisjs/core/services/router'

import User from '#users/models/user'

export default class ResetPasswordNotification extends BaseMail {
  from = env.get('EMAIL_FROM')
  subject = `Reset your password for app`

  constructor(
    private user: User,
    private token: string
  ) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  async prepare() {
    /**
     * Generate a signed URL with the user's email,
     * which can be used to reset the password.
     */
    const signedUrl = router.makeSignedUrl(
      'auth.reset_password.show',
      { token: this.token },
      { expiresIn: '30m', prefixUrl: env.get('APP_URL'), purpose: 'reset_password' }
    )

    this.message.to(this.user.email)

    this.message.htmlView('auth::emails/forgot_password', { signedUrl })
  }
}
