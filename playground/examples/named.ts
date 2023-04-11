import { Nuxt } from '@nuxt/schema'
import { defineNuxtModule } from '@nuxt/kit'
import { useSocketServer, } from '../../src/runtime/server'
import { getTime, getCount } from './utils'

/**
 * Create a socket that will respond only to its given name
 */
export default defineNuxtModule({
  setup (options: any, nuxt: Nuxt) {
    const namedSocket = useSocketServer(nuxt, 'named', function (message: any) {
      // log message
      console.log({ handler: 'named', ...message })

      // send message back
      setTimeout(() => {
        namedSocket.send({
          message: 'Hello to name from server!',
          time: getTime(),
          count: getCount(),
        })
      }, 1000)
    })
  }
})
