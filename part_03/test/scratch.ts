import { NostrSocket, Signer } from '../src/index.js'

const signer = Signer.generate()
const pubkey = await signer.getPublicKey()
const relays = [ 'wss://relay.damus.io' ]
const config = { echo: true, cipher: 'deadbeef' }

const socket = new NostrSocket(signer, pubkey, relays, config)

socket.pub('ping', 'Hello world!')
