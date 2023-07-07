import { 
  SocketConfig, 
  SocketOptions, 
  get_config 
} from './config.js'

export class NostrSocket {
  readonly _secret : string
  readonly opt     : SocketOptions
  constructor (
    secret : string, 
    config : SocketConfig
  ) {
    this._secret = secret
    this.opt     = get_config(config)
  }
}
