import 'websocket-polyfill'

import {
  Event,
  EventTemplate,
  Filter,
  SimplePool,
  Sub,
  UnsignedEvent,
  generatePrivateKey,
  getEventHash,
  getPublicKey,
  getSignature,
  validateEvent
} from 'nostr-tools'

import { 
  SocketConfig, 
  SocketOptions, 
  get_config 
} from './config.js'

import * as util from './utils.js'

export class NostrSocket {
  readonly _pool   : SimplePool
  readonly _pubkey : string
  readonly _signer : Signer
  readonly filter  : Filter
  readonly relays  : string[]
  readonly opt     : SocketOptions

  _sub : Sub

  constructor (
    signer  : Signer,
    pubkey  : string,
    relays  : string[],
    config ?: SocketConfig
  ) {
    this._pool   = new SimplePool()
    this._pubkey = pubkey
    this._signer = signer

    this.relays  = relays
    this.opt     = get_config(config)

    this.filter  = { 
      kinds : [ this.opt.kind ],
      since : util.now(),
    }

    this._sub    = this.sub(this.filter)
  }

  get pool () : SimplePool {
    return this._pool
  }

  get pubkey () : string {
    return this._pubkey
  }

  get template () : EventTemplate {
    return {
      kind : this.opt.kind,
      tags : this.opt.tags,
      content    : '',
      created_at : util.now()
    }
  }

  _isEcho (event : Event) : boolean {
    return (
      !this.opt.echo && 
      event.pubkey === this.pubkey
    )
  }

  _eventHandler (event : Event)  {
    try {
      util.verifyEvent(event)
      if (this._isEcho(event)) return
      const [ label, payload ] = util.parseEvent(event)
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
    const base   = { ...this.template, ...template }
    const temp   = util.formatEvent(eventName, payload, base)
    const event  = { ...temp, pubkey: this.pubkey }
    const signed = await this._signer.signEvent(event)
    const pub    = this._pool.publish(this.relays, signed)
    return pub
  }
}

export class Signer {
  static generate () : Signer {
    const sec = generatePrivateKey()
    return new Signer(sec)
  }

  readonly _secret : string

  constructor (secret : string) {
    this._secret = secret
  }

  async getPublicKey () : Promise<string> {
    return getPublicKey(this._secret)
  }

  async signEvent(event : UnsignedEvent) : Promise<Event> {
    validateEvent(event)
    const id  = getEventHash(event)
    const sig = getSignature(event, this._secret)
    return { ...event, id, sig }
  }
}
