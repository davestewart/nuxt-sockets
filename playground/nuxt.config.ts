import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma-rtl.min.css' }
      ]
    }
  },

  modules: [
    '../src/module',
    resolve('examples/named'),
    resolve('examples/filtered'),
  ],
})
