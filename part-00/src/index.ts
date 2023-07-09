import { 
  SocketConfig, 
  SocketOptions, 
  get_config 
} from './config.js'

export default class NostrSocket {
  readonly opt : SocketOptions

  constructor (
    config : SocketConfig
  ) {
    this.opt = get_config(config)
  }
}

export class Signer {
  readonly _secret : string

  constructor (secret : string) {
    this._secret = secret
  }
}
