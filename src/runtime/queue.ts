import { Callback, Handler, MessageEvent } from './types'

export class HandlerQueue {
  public handlers: Handler[]

  constructor () {
    this.handlers = []
    this.handle = this.handle.bind(this)
  }

  add (handler: Callback | Handler): HandlerQueue {
    if (typeof handler === 'function') {
      handler = { channel: '*', callback: handler }
    }
    if (typeof handler.callback === 'function') {
      this.handlers.push(handler as Handler)
    }
    return this
  }

  remove (callback: Callback): HandlerQueue {
    this.handlers = this.handlers.filter(handler => handler.callback !== callback)
    return this
  }

  reset (): HandlerQueue {
    this.handlers = []
    return this
  }

  handle (event: MessageEvent) {
    const { channel, data } = parseMessage(event)
    if (channel) {
      this.handlers
        .filter(handler => matchChannel(channel!, handler.channel))
        .forEach(handler => handler.callback({ channel, data }))
    }
  }
}

function parseMessage (event: MessageEvent) {
  try {
    return JSON.parse(event.data || '{}')
  }
  catch (err) {
    console.error('Could not parse socket message data')
    return {}
  }
}

export function matchChannel (source: string, target: string) {
  if (target === '*') {
    return true
  }
  if (target.includes('*')) {
    const rx = makeMatcher(target)
    return rx.test(source)
  }
  if (source.includes('*')) {
    const rx = makeMatcher(source)
    return rx.test(target)
  }
  return target === source
}

function makeMatcher (value: string): RegExp {
  return new RegExp(`^${value.replace(/\*/g, '[^:]+')}$`)
}
