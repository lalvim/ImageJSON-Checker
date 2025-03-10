import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

import AbilitiesService from '#users/services/abilities_service'
import User from '#users/models/user'
import UserDto from '#users/dtos/user'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    user: async (ctx) => {
      if (ctx.auth?.user) {
        await User.preComputeUrls(ctx.auth?.user)

        return new UserDto(ctx.auth?.user)
      }
    },
    flashMessages: (ctx) => ctx.session?.flashMessages.all(),
    abilities: (ctx) => {
      if (!ctx.auth?.user) {
        return []
      }

      return new AbilitiesService().getAllAbilities(ctx.auth?.user)
    },
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: true,
    entrypoint: 'app/core/ui/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
