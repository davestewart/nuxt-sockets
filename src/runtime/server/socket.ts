import type { IncomingMessage } from 'http'
import { WebSocketServer } from 'ws'
import { Callback } from '../types'
import { HandlerQueue } from '../queue'

/**
 * Core socket functionality lifted from Nuxt Content
 * @see https://github.com/nuxt/content/blob/4dd4cb9b7fe657a63e493d63e2c19a534739206b/src/utils.ts#L126
 */
export function createWebSocket () {
  const wss = new WebSocketServer({ noServer: true })

  const serve = (req: IncomingMessage, socket = req.socket, head: any = '') =>
    wss.handleUpgrade(req, socket, head, (client: any) => wss.emit('connection', client, req))

  const broadcast = (channel: string, data: any) => {
    data = JSON.stringify({ channel, data })
    for (const client of wss.clients) {
      try {
        client.send(data)
      }
      catch (err) {
        /* Ignore error (if client not ready to receive event) */
      }
    }
  }

  // queue
  const queue = new HandlerQueue()
  const addHandler = <T>(channel: string, callback: Callback<T>) => {
    queue.add({ channel, callback })
  }

  wss.on('connection', (client: any) => {
    client.addEventListener('message', queue.handle)
  })

  return {
    wss,
    serve,
    broadcast,
    addHandler,
    close () {
      wss.clients.forEach((client: any) => client.close())
      return new Promise(resolve => wss.close(resolve))
    }
  }
}
