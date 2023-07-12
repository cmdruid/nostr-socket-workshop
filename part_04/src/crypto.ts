import { Buff, Bytes } from '@cmdcode/buff-utils'
import { Event, EventTemplate } from 'nostr-tools'

// Attempt to import the crypto library from somewhere.
const { subtle } = globalThis?.crypto ?? crypto ?? window?.crypto

if (
  typeof subtle === 'undefined'  ||
  subtle.importKey === undefined ||
  subtle.encrypt   === undefined ||
  subtle.decrypt   === undefined
) {
  throw new Error('Subtle crypto library not found on this device!')
}

async function get_key (secret : Bytes) {
  /* Convert our secret into a CryptoKey object. */
  const seed    = Buff.bytes(secret)
  const options = { name: 'AES-CBC' }
  const usage   = [ 'encrypt', 'decrypt' ] as KeyUsage[]
  return subtle.importKey('raw', seed, options, true, usage)
}

export async function encrypt (
  message : string,
  secret  : Bytes,
  vector ?: Bytes
) {
  /* Encrypt a message using a CryptoKey object. */
  const key = await get_key(secret)
  const msg = Buff.str(message)
  const iv  = (vector !== undefined)
    ? Buff.bytes(vector)
    : Buff.random(16)
  const opt = { name: 'AES-CBC', iv }
  return subtle.encrypt(opt, key, msg)
    .then((bytes) => new Buff(bytes).base64 + '?iv=' + iv.base64)
}

export async function decrypt (
  encoded : string,
  secret  : Bytes
) {
  /* Decrypt an encrypted message using a CryptoKey object. */
  if (!encoded.includes('?iv=')) {
    throw new Error('Missing vector on encrypted message!')
  }
  const [ message, vector ] = encoded.split('?iv=')
  const key = await get_key(secret)
  const msg = Buff.base64(message)
  const iv  = Buff.base64(vector)
  const opt = { name: 'AES-CBC', iv }
  return subtle.decrypt(opt, key, msg)
    .then(decoded => new Buff(decoded).str)
}

export function get_secret (seed : string) : string {
  /* Convert our seed phrase into a valid secret. */
  return Buff.str(seed).digest.hex
}
export function get_label (secret : string) : string {
  /* Convert our secret into a valid label */
  return Buff.hex(secret).digest.hex
}

export async function encrypt_event (
  template : EventTemplate,
  secret  ?: string
) : Promise<EventTemplate> {
  // Copy our template into a new object.
  const temp = { ...template }
  // If a secret string is provided:
  if (typeof secret === 'string') {
    // Unpack our event template.
    const { content, tags } = temp
    // Get the public hash of the secret.
    const label      = get_label(secret)
    // Encrypt the content of the event.
    const encrypted  = await encrypt(content, secret)
    // Update our template with the changes.
    temp.content = encrypted
    temp.tags    = [ ...tags, [ 'h', label ]]
  }
  // Return the event template.
  return temp
}

export async function decrypt_event (
  event   : Event,
  secret ?: string
) : Promise<Event> {
  // Copy the event into a new object.
  const ev_copy = { ...event }
  // If a secret string is provided:
  if (typeof secret === 'string') {
    // Unpack our event object.
    const { content, tags } = ev_copy
    // Compute the label from the secret.
    const label  = get_label(secret)
    // Filter the 'h' tags from the tags array.
    const htags  = tags.filter(e => e[0] === 'h')
    // Strip out everything but the hashes.
    const hashes = htags.map(e => e[1])
    // If the event matches our criteria:
    if (
      hashes.includes(label) &&
      content.includes('?iv=')
    ) {
      // Decrypt the event content.
      ev_copy.content = await decrypt(content, secret)
      // Return event content as JSON.
    }
  }
  return ev_copy
}
