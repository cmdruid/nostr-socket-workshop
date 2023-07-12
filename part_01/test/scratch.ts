import { NostrSocket } from '../src/index.js'

const relays = [ 'wss://relay.damus.io' ]
const config = { kind: 1 }

const socket = new NostrSocket(relays, config)
