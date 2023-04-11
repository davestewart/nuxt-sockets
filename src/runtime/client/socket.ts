import { useRuntimeConfig } from '#app'
import { Callback, SocketInstance } from '../types'
import { HandlerQueue } from '../queue'

function createWebSocket () {
  const plugin = '[Nuxt Sockets]'
  const logger = {
    // eslint-disable-next-line no-console
    log: (...args: any[]) => console.log(plugin, ...args),
    // eslint-disable-next-line no-console
    warn: (...args: any[]) => console.warn(plugin, ...args)
  }

  // bail if not supported
  if (!window.WebSocket) {
    logger.warn('Unable to hot-reload images, your browser does not support WebSocket')
    return null
  }

  const onError = (e: any) => {
    switch (e.code) {
      case 'ECONNREFUSED':
        connect(true)
        break
      default:
        logger.warn('Error:', e)
        break
    }
  }

  const onClose = (e: any) => {
    // https://tools.ietf.org/html/rfc6455#section-11.7
    if (e.code === 1000 || e.code === 1005) {
      // normal close
      logger.log('Closed')
    }
    else {
      // unknown error
      connect(true)
    }
  }

  const send = (channel: string, data: any) => {
    if (ws) {
      ws.send(JSON.stringify({ channel, data }))
    }
  }

  const queue = new HandlerQueue()
  const addHandler = <T> (channel: string, callback: Callback<T>) => {
    queue.add({ channel, callback })
  }

  // websocket
  let ws: WebSocket

  // connect
  const connect = (retry = false) => {
    // if retrying, wait for a second
    if (retry) {
      logger.log('Reconnecting...')
      setTimeout(connect, 1000)
      return
    }

    // otherwise, create the socket
    const url = useRuntimeConfig().public.sockets?.wsUrl
    const wsUrl = `${url}ws`
    ws = new WebSocket(wsUrl)

    // setup
    ws.onopen = () => logger.log(`Connected on ${wsUrl}`)
    ws.onmessage = queue.handle
    ws.onerror = onError
    ws.onclose = onClose
  }
  connect()

  return {
    send,
    addHandler,
  }
}

let ws: ReturnType<typeof createWebSocket>

export function useSocket<T> (channel: string, callback?: Callback<T>): SocketInstance<T> | null {
  // create on first use
  if (!ws) {
    ws = createWebSocket()
  }

  // instance
  const instance = {
    send (data: any) {
      ws?.send(channel, data)
      return this
    },
    addHandler<T> (filter: string, callback: Callback<T>) {
      ws?.addHandler(filter ? channel.replace(/(:\*)?$/, `:${filter}`) : channel, callback)
      return this
    }
  }

  if (callback) {
    instance.addHandler<T>('', callback)
  }

  // return
  return instance
}
