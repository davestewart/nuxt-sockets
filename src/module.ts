import { defineNuxtModule, createResolver, addImports } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export interface ModuleOptions {
  port: {
    port: 4001,
    portRange: [4001, 4040]
  },
  hostname: 'localhost',
  showURL: false
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-sockets',
    configKey: 'sockets',
  },

  async setup () {
    addImports([
      {
        name: 'useSocketServer',
        from: resolve('runtime/server'),
      },
      {
        name: 'useSocketClient',
        from: resolve('runtime/client'),
      },
    ])
  }
})
