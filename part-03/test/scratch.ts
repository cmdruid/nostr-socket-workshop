import { NostrSocket, Signer } from '../src/index.js'

const signer = Signer.generate()
const pubkey = await signer.getPublicKey()
const relays = [ 'wss://spore.ws' ]
const config = { echo: true, cipher: 'test' }

const socket = new NostrSocket(signer, pubkey, relays, config)

socket.pub('ping', 'Hello world!')

// socket.cipher = 'deadbeef'
