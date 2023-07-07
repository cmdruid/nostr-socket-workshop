import { NostrSocket, Signer } from '../src/index.js'

const signer = Signer.generate()
const pubkey = await signer.getPublicKey()
const relays = [ 'wss://spore.ws' ]
const config = { echo: true, cipher : 'deadbeef' }

const socket = new NostrSocket(signer, pubkey, relays, config)

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
