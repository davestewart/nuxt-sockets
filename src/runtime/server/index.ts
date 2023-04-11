import { listen, ListenOptions } from 'listhen'
import { Nuxt } from '@nuxt/schema'
import { Callback, SocketInstance } from '../types'
import { createWebSocket } from './socket'

const ws = createWebSocket()
let initialized = false

/**
 * Core sockets / nitro functionality lifted from
 * @see https://github.com/nuxt/content/blob/4dd4cb9b7fe657a63e493d63e2c19a534739206b/src/module.ts#L676
 */
export function useSocketServer <T>(nuxt: Nuxt, channel: string, callback ?: Callback<T>): SocketInstance<T> {
  nuxt.hook('nitro:init', async (nitro) => {
    if (!initialized) {
      // set initialized
      initialized = true

      // options
      // @ts-ignore
      const options: Partial<ListenOptions> = nuxt.options.sockets || {}

      // listen dev server
      const { server, url } = await listen(() => 'Nuxt Sockets', options)

      // start server
      server.on('upgrade', ws.serve)

      // share URL
      nitro.options.runtimeConfig.public.sockets = {
        wsUrl: url.replace('http', 'ws')
      }

      // close on nuxt close
      nitro.hooks.hook('close', async () => {
        await ws.close()
        await server.close()
      })
    }
  })

  // return
  const instance = {
    send (data: any) {
      ws.broadcast(channel, data)
      return this
    },
    addHandler <T>(filter: string, callback: Callback<T>) {
      ws.addHandler(filter ? channel.replace(/(:\*)?$/, `:${filter}`) : channel, callback)
      return this
    }
  }

  // optional handler
  if (callback) {
    instance.addHandler('', callback)
  }

  // return
  return instance
}
