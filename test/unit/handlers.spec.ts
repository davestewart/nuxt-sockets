import { describe, it, expect } from 'vitest'
import { HandlerQueue, matchChannel } from '../../src/runtime/queue'

/**
 * Dummy Message class
 */
class Message {
  data: string
  constructor (channel: string = '*', data = 'test') {
    this.data = JSON.stringify({ channel, data })
  }
}

describe('queue', function () {
  it('should call events', function () {
    const queue = new HandlerQueue()
    let called = false
    const test = () => {
      called = true
    }
    queue.add(test)
    queue.handle(new Message())
    expect(called).toBe(true)
  })
})


describe('matcher', function () {
  it('should match word', function () {
    expect(matchChannel('named', 'named')).toBe(true)
    expect(matchChannel('named', 'test')).toBe(false)
  })
  it('should match star', function () {
    expect(matchChannel('*', 'named')).toBe(true)
    expect(matchChannel('*', '*')).toBe(true)
  })
  it('should match segment and star', function () {
    expect(matchChannel('named:*', 'named:test')).toBe(true)
    expect(matchChannel('*:*', 'named:test')).toBe(true)
    expect(matchChannel('*', 'named:test')).toBe(false)
    expect(matchChannel('named:*', 'named:')).toBe(false)
    expect(matchChannel('named:*', 'blah')).toBe(false)
  })
})
