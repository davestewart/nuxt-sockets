# Nuxt Sockets

> WebSockets solution for Nuxt

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

## Overview

Nuxt Sockets implements bidirectional sockets communication between Nitro and Nuxt. 

It supports named channels making it ideal for plugin authors.

```ts
// server
const socket = useSocketServer('my-plugin')
socket.send('ping!')
```

```ts
// client
const socket = useSocketClient('my-plugin', ({ channel: string, data: any }) => {
  console.log(data) // ping!
})
```

## Demo

To view the demo live on StackBlitz:

- https://stackblitz.com/github/davestewart/nuxt-sockets?file=playground%2Fapp.vue

To run the demo locally:

```
npm run dev
```

## Quick Setup

Installation:

```bash
npm install --save @davestewart/nuxt-sockets
```

Configuration:

```js
export default defineNuxtConfig({
  modules: [
    '@davestewart/nuxt-sockets'
  ],
})
```

## Usage

### Server

Here's how you might set up the server to watch some files, then report them to the frontend:

```ts
// module.ts
import { createStorage } from 'unstorage'
import { useSocketServer } from '@davestewart/nuxt-sockets'

export default function (options, nuxt) {
  // create the server
  const socket = useSocketServer('my-plugin')
  
  // watch files for changes
  const storage = createStorage(dirname)
  storage.watch(function (event, key) => {            
    socket.send({ event, key })              
  })
  
  // handle incoming messages
  socket.onMessage(({ data }) => {
    console.log('message:', data)
  })
}
```

### Client

The client should take the same name as the server, so calls are sent between the two, and they don't clash with any other services using sockets.

```ts
export default defineNuxtPlugin(async () => {
  if (process.client) {
    // receive a message
    const socket = await useSocketClient('my-plugin', ({ data }) => {
      console.log('file changed', data)
    })
    
    // send a message
    window.addEventListener('click', () => {
      socket.send('user clicked')
    })
  }
})
```

### Alternative setups

You can create a Socket instance in several ways:

```ts
// generic server (not recommended)
const socket = useSocketServer()

// named server
const socket = useSocketServer('some-name')

// named server and default handler
const socket = useSocketServer('some-name', ({ channel, data }) => {
  console.log({ channel, data })
})

// named server and filter handler
const socket = useSocketServer('some-name').addHandler<Bar>('foo', ({ data }) => {
  console.log(data.baz)
})
```

The library also has some generic typing, so you can hint the return data type:

```ts
// example types
type Foo = { foo: string }
type Bar = { bar: string }
type Baz = { baz: string }

// hint the composable
const socket = useSocketServer<Foo>('plugin', ({ data }) => {
  console.log(data.foo)
})

// hint the handler
const socket = useSocketServer<SomeClass>('plugin', ({ data }) => {
  console.log(data.bar)
})


// hint the handler
const socket = useSocketServer<SomeClass>('plugin').addHandler<Bar>('foo', ({ data }) => {
  console.log(data.baz)
})
```

### Filtering

The module supports basic filtering, but this may be taken out in the next version.

## Development

To develop the module:

```bash
# develop the module using the demo
npm run dev

# build and release (make sure to update version and changelog first)
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@davestewart/nuxt-sockets/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@davestewart/nuxt-sockets

[npm-downloads-src]: https://img.shields.io/npm/dm/@davestewart/nuxt-sockets.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@davestewart/nuxt-sockets

[license-src]: https://img.shields.io/npm/l/@davestewart/nuxt-sockets.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@davestewart/nuxt-sockets

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
