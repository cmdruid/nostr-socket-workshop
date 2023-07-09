import 'websocket-polyfill'

import { Filter, SimplePool } from 'nostr-tools'
import { now } from '../src/utils.js'
// import { NostrSocket } from '../src/index.js'

const relays = [ 'wss://relay.damus.io' ]
const config = { kind: 1 }

const filter : Filter = {
  limit : 10,
  kinds : [ 1 ],
  since : now() - (60 * 60),
}

const pool = new SimplePool()
const sub  = pool.sub(relays, [ filter ])

sub.on('event', (event) => {
  console.log('event:', event)
})

sub.on('eose', () => {
  console.log('subscribed!')
})

// const socket = new NostrSocket(relays, config)
