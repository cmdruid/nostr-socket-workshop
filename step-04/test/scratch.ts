import { Buff } from '@cmdcode/buff-utils'
import { NostrSocket } from '../src/index.js'

const relays = [ 'wss://spore.ws' ]
const secret = Buff.str('alice').digest.hex
const config = { echo: true, cipher: 'test' }

const socket = new NostrSocket(relays, secret, config)

socket.on('ping', (msg, envelope) => {
  console.log('msg:', msg)
  console.log('env:', envelope)
})

socket.on('ok', (data) => {
  console.log('ok', data)
})

socket.on('failed', (data) => {
  console.log('failed', data)
})

socket.pub('ping', 'Hello world!')
