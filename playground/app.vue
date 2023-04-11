<!--suppress ALL -->
<template>
  <div class="container is-max-desktop px-5 py-5">
    <div class="content">
      <h1>Nuxt Sockets Demo</h1>
      <section>
        <pre>"named": {{ named }}</pre>
        <button class="button" @click="sendMessage(namedSocket)">Call "named"</button>
      </section>
      <section>
        <pre>"item:one": {{ itemOne }}</pre>
        <button class="button" @click="sendMessage(itemOneSocket)">Call "item:one"</button>
      </section>
      <section>
        <pre>"item:two": {{ itemTwo }}</pre>
        <button class="button" @click="sendMessage(itemTwoSocket)">Call "item:two"</button>
      </section>
      <button class="button" @click="sendMessage(itemSocket)">Call "item:*"</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSocketClient } from '../src/runtime/client'
import { getCount, getTime } from './examples/utils'

// data
const named = ref('Waiting for data...')
const itemOne = ref('Waiting for data...')
const itemTwo = ref('Waiting for data...')

// create named socket and handler
const namedSocket = await useSocketClient('named', ({ data }) => {
  named.value = data
})

// create sockets which can be targeted with *
const itemOneSocket = await useSocketClient('item:one', ({ data }) => {
  itemOne.value = data
})
const itemTwoSocket = await useSocketClient('item:two', ({ data }) => {
  itemTwo.value = data
})
const itemSocket = await useSocketClient('item:*')

// send message to server
function sendMessage (sender) {
  sender.send({
    message: 'Hello from client!',
    time: getTime(),
    count: getCount(),
  })
}
</script>

<style>
section {
  position: relative;
}

section button {
  position: absolute !important;
  top: 1rem;
  right: 1rem;
}

pre {
  min-height: 70px;
}
</style>
