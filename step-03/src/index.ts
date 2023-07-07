import 'websocket-polyfill'

import {
  Event,
  EventTemplate,
  Filter,
  SimplePool,
  Sub,
  getPublicKey
} from 'nostr-tools'

import { 
  SocketConfig, 
  SocketOptions, 
  get_config 
} from './config.js'

import * as crypto from './crypto.js'
import * as util   from './utils.js'

export class NostrSocket {
  readonly _pool   : SimplePool
  readonly _secret : string
  readonly filter  : Filter
  readonly relays  : string[]
  readonly opt     : SocketOptions

  _cipher ?: string
  _sub     : Sub

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
      since : util.now(),
    }

    this.cipher  = config?.cipher
    this._sub    = this.sub(this.filter)
  }

  get cipher () : string | undefined {
    return (this._cipher !== undefined)
      ? crypto.getLabel(this._cipher)
      : undefined
  }

  set cipher (secret : string | undefined) {
    if (secret === undefined) {
      this._cipher = undefined
      delete this.filter['#h']
    } else {
      this._cipher      = crypto.getCipher(secret)
      this.filter['#h'] = [ crypto.getLabel(this._cipher) ]
    }
  }

  get pool () : SimplePool {
    return this._pool
  }

  get pubkey () : string {
    return getPublicKey(this._secret)
  }

  get template () : EventTemplate {
    return {
      kind : this.opt.kind,
      tags : this.opt.tags,
      content    : '',
      created_at : util.now()
    }
  }

  _echoHandler (event : Event) : boolean {
    return (!this.opt.echo && util.is_author(event, this.pubkey))
  }

  async _eventHandler (event : Event) : Promise<void> {
    try {
      util.verifyEvent(event)
      if (this._echoHandler(event)) return
      const dec = await crypto.decryptEvent(event, this._cipher)
      const [ label, payload ] = util.parseEvent(dec)
      console.log(`[${label}]: ${payload}`)
    } catch (err) {
      console.log('Failed to handle event:', event)
      console.log(err)
    }
  }

  sub (filter : Filter) {
    const sub = this.pool.sub(this.relays, [ filter ])
    sub.on('event', (event) => {
      void this._eventHandler(event)
    })
    return sub
  }

  async pub (
    eventName : string,
    payload   : any,
    template ?: Partial<EventTemplate>
  ) {
    const base  = { ...this.template, ...template }
    let temp    = util.formatEvent(eventName, payload, base)
        temp    = await crypto.encryptEvent(temp, this._cipher)
    const event = util.signEvent(temp, this._secret)
    return this._pool.publish(this.relays, event)
  }
}
