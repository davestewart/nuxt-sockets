export type Callback<T = any> = (message: SocketMessage<T>) => void

export interface SocketInstance<T> {
  send: (data: T) => SocketInstance<T>
  addHandler: <T>(filter: string, handler: Callback<T>) => SocketInstance<T>
}

export interface SocketMessage<T> {
  channel: string
  data: T
}

export type MessageEvent = {
  data: string
}

export type Handler = {
  channel: string
  callback: Callback
}
