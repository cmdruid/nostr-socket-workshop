import 'websocket-polyfill'

import { EventEmitter } from './emitter.js'

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

export class NostrSocket extends EventEmitter {
  readonly _pool   : SimplePool
  readonly _secret : string
  readonly filter  : Filter
  readonly relays  : string[]
  readonly opt     : SocketOptions

  _cipher  ?: string
  _sub      : Sub

  constructor (
    relays  : string[],
    secret  : string,
    config ?: SocketConfig
  ) {
    super()

    this._pool   = new SimplePool()
    this._secret = secret

    this.relays  = relays
    this.opt     = get_config(config)

    this.filter  = { 
      kinds : [ this.opt.kind ],
      since : util.now() - 60,
    }

    this.cipher    = config?.cipher
    this._sub      = this.sub(this.filter)
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

  async _eventHandler (event : Event) : Promise<void> {
    try {
      util.verifyEvent(event)
      if (this._echoHandler(event)) return
      const dec = await crypto.decryptEvent(event, this._cipher)
      const [ label, payload ] = util.parseEvent(dec)
      this.emit(label, payload, event)
    } catch (err) {
      const { message } = err as Error
      this.emit('_err', [ message, event ])
    }
  }

  _echoHandler (event : Event) : boolean {
    return (!this.opt.echo && util.is_author(event, this.pubkey))
  }

  sub (filter : Filter) {
    const sub = this.pool.sub(this.relays, [ filter ])
    sub.on('eose', () => { this.emit('_eose') })
    sub.on('event', (event) => {
      this._eventHandler(event)
      this.emit('_event', [ event ])
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
    const pub   = this._pool.publish(this.relays, event)
    pub.on('ok', (...data : any[]) => this.emit('_ok', data))
    pub.on('failed', (...data : any[]) => this.emit('_failed', data))
    return pub
  }
}
