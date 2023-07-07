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

async function getKey (secret : Bytes) {
  /** Derive a CryptoKey object (for Webcrypto library). */
  const seed    = Buff.bytes(secret)
  const options = { name: 'AES-CBC' }
  const usage   = [ 'encrypt', 'decrypt' ] as KeyUsage[]
  return subtle.importKey('raw', seed, options, true, usage)
}

export function getCipher (secret : string) : string {
  return Buff.str(secret).digest.hex
}
export function getLabel (cipher : string) : string {
  return Buff.hex(cipher).digest.hex
}

export async function encrypt (
  message : string,
  secret  : Bytes,
  vector ?: Bytes
) {
  /** Encrypt a message using a CryptoKey object. */
  const key = await getKey(secret)
  const msg = Buff.str(message)
  const iv  = (vector !== undefined)
    ? Buff.bytes(vector)
    : Buff.random(16)
  const opt = { name: 'AES-CBC', iv }
  return subtle.encrypt(opt, key, msg)
    .then((bytes) => Buff.raw(bytes).base64 + '?iv=' + iv.base64)
}

export async function decrypt (
  encoded : string,
  secret  : Bytes
) {
  /** Decrypt an encrypted message using a CryptoKey object. */
  if (!encoded.includes('?iv=')) {
    throw new Error('Missing vector on encrypted message!')
  }
  const [ message, vector ] = encoded.split('?iv=')
  const key = await getKey(secret)
  const msg = Buff.base64(message)
  const iv  = Buff.base64(vector)
  const opt = { name: 'AES-CBC', iv }
  return subtle.decrypt(opt, key, msg)
    .then(decoded => Buff.raw(decoded).str)
}

export async function encryptEvent (
  template : EventTemplate,
  cipher  ?: string
) : Promise<EventTemplate> {
  const tmp = { ...template }
  if (typeof cipher === 'string') {
    const { content, tags } = tmp
    const label      = getLabel(cipher)
    const encrypted  = await encrypt(content, cipher)
    tmp.content = encrypted
    tmp.tags    = [ ...tags, [ 'h', label ]]
  }
  return tmp
}

export async function decryptEvent (
  event   : Event,
  cipher ?: string
) : Promise<Event> {
  const ev = { ...event }
  if (typeof cipher === 'string') {
    const { content, tags } = ev
    // Compute the label from the secret.
    const label  = getLabel(cipher)
    // Filter the 'h' tags from the tags array.
    const htags  = tags.filter(e => e[0] === 'h')
    // Strip out everything but the hashes.
    const hashes = htags.map(e => e[1])
    // Check if the event meets our criteria.
    if (
      hashes.includes(label) &&
      content.includes('?iv=')
    ) {
      // Decrypt the event content.
      ev.content = await decrypt(content, cipher)
      // Return event content as JSON.
    }
  }
  return ev
}
