/**
 * Configuration File
 */

// Defines our options interface.
export interface SocketOptions {}

// For using partial config objects.
export type SocketConfig = Partial<SocketOptions>

// Defines our default options.
export const DEFAULTS : SocketOptions = {}

export function get_config (
  config : SocketConfig = {}
) : SocketOptions {
  /* Applies our default options, plus custom configs.
   */
  return { ...DEFAULTS, ...config  }
}
