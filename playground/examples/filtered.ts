import { Nuxt } from '@nuxt/schema'
import { defineNuxtModule } from '@nuxt/kit'
import { useSocketServer, } from '../../src/runtime/server'
import { getTime, getCount } from './utils'

/**
 * Create a socket that will respond only to item:one and item:two
 */
export default defineNuxtModule({
  setup (options: any, nuxt: Nuxt) {
    const itemsSocket = useSocketServer(nuxt, 'item:*', function (message: any) {
      // log message
      console.log({ handler: 'item:*', ...message })

      // send message back
      setTimeout(() => {
        itemsSocket.send({
          message: 'Hello to items from server!',
          time: getTime(),
          count: getCount(),
        })
      }, 1000)
    })
      .addHandler('one', () => {
        console.log({ handler: 'item:one' })
      })
      .addHandler('two', () => {
        console.log({ handler: 'item:two' })
      })
  }
})
