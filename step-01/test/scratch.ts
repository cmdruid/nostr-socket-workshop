import 'websocket-polyfill'
import { Filter, SimplePool } from 'nostr-tools'
import { now } from '../src/utils.js'

const relays = [ 'wss://relay.snort.social' ]

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
