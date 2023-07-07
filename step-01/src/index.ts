import 'websocket-polyfill'
import { now } from './utils.js'

import {
  Event,
  Filter,
  SimplePool,
  Sub
} from 'nostr-tools'

import { 
  SocketConfig, 
  SocketOptions, 
  get_config 
} from './config.js'

export class NostrSocket {
  readonly _pool   : SimplePool
  readonly _secret : string
  readonly filter  : Filter
  readonly relays  : string[]
  readonly opt     : SocketOptions

  _sub : Sub

  constructor (
    relays  : string[],
    secret  : string,
    config ?: SocketConfig
  ) {
    this._pool   = new SimplePool()
    this._secret = secret

    this.relays  = relays
    this.opt     = get_config(config)

    this.filter  = { 
      kinds : [ this.opt.kind ],
      since : now(),
    }

    this._sub    = this.sub(this.filter)
  }

  get pool () : SimplePool {
    return this._pool
  }

  sub (filter : Filter) {
    const sub = this.pool.sub(this.relays, [ filter ])
    sub.on('event', (event) => {
      void this.eventHandler(event)
    })
    return sub
  }

  eventHandler (event : Event) {
    console.log('event:', event)
  }
}
