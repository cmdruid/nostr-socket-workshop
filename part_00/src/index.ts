import { 
  SocketConfig, 
  SocketOptions, 
  socket_config 
} from './config.js'

export class NostrSocket {
  readonly opt : SocketOptions

  constructor (
    config ?: SocketConfig
  ) {
    this.opt = socket_config(config)
  }
}

export class Signer {
  readonly _secret : string

  constructor (secret : string) {
    this._secret = secret
  }
}
