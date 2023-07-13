import { NostrSocket, Signer } from '../src/index.js'

const signer = Signer.generate()
const pubkey = await signer.getPublicKey()
const relays = [ 'wss://spore.ws' ]
const config = { echo: false, cipher : 'deadbeef' }

const socket = new NostrSocket(signer, pubkey, relays, config)

socket.on('pong', (payload, envelope) => {
  console.log('msg:', payload)
  console.log('env:', envelope)
})

socket.on('_eose', () => {
  console.log('connected!')
})

socket.on('ok', (data) => {
  console.log('ok', data)
})

socket.on('failed', (data) => {
  console.log('failed', data)
})

socket.pub('ping', 'Hello from localhost!')
