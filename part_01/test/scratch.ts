import { NostrSocket } from '../src/index.js'

const relays = [ 'wss://relay.damus.io' ]
const config = { kind: 1 }

new NostrSocket(relays, config)
