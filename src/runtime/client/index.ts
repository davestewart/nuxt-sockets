import { useRuntimeConfig } from '#imports'
import { Callback, SocketInstance } from '../types'

export function useSocketClient <T>(channel: string = '*', callback?: Callback<T>): Promise<SocketInstance | null> {
  const url = useRuntimeConfig().public.sockets?.wsUrl
  return new Promise(function (resolve) {
    if (process.client && url) {
      import('./socket').then(({ useSocket }) => {
        resolve(useSocket<T>(channel, callback))
      })
    }
    else {
      resolve(null)
    }
  })
}
