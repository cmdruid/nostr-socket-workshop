export interface SocketOptions {
  kind : number
}

export type SocketConfig = Partial<SocketOptions>

export const DEFAULTS : SocketOptions = {
  kind : 20000
}

export function socket_config (
  config : SocketConfig = {}
) : SocketOptions {
  return { ...DEFAULTS, ...config  }
}
