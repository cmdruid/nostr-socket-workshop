import 'websocket-polyfill'

import {
  Event,
  Filter,
  SimplePool,
  Sub
} from 'nostr-tools'

import { 
  SocketConfig, 
  SocketOptions, 
  socket_config 
} from './config.js'

import * as util from './utils.js'

export class NostrSocket {
  readonly _pool   : SimplePool
  readonly filter  : Filter
  readonly relays  : string[]
  readonly opt     : SocketOptions

  _sub : Sub

  constructor (
    relays  : string[],
    config ?: SocketConfig
  ) {
    this._pool   = new SimplePool()

    this.relays  = relays
    this.opt     = socket_config(config)

    this.filter  = { 
      kinds : [ this.opt.kind ],
      since : util.now(),
    }

    this._sub    = this.sub(this.filter)
  }

  get pool () : SimplePool {
    return this._pool
  }

  sub (filter : Filter) {
    const sub = this.pool.sub(this.relays, [ filter ])
    sub.on('event', (event : Event) => {
      this._eventHandler(event)
    })
    return sub
  }

  _eventHandler (event : Event) {
    console.log('event:', event)
  }
}
