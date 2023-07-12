export interface SocketOptions {
  echo : boolean
  kind : number
  tags : string[][]
}

export type SocketConfig = Partial<SocketOptions>

export const DEFAULTS : SocketOptions = {
  echo : false,
  kind : 20000,
  tags : []
}

export function socket_config (
  config : SocketConfig = {}
) : SocketOptions {
  return { ...DEFAULTS, ...config  }
}
