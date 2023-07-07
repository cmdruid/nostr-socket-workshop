import { Buff } from '@cmdcode/buff-utils'
import { NostrSocket } from '../src/index.js'

const relays = [ 'wss://spore.ws' ]
const secret = Buff.str('alice').digest.hex
const config = { echo: true }
const socket = new NostrSocket(relays, secret, config)

socket.pub('ping', 'Hello world!')
