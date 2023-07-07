import {
  Event,
  EventTemplate,
  getEventHash,
  getPublicKey,
  getSignature,
  validateEvent,
  verifySignature
} from 'nostr-tools'

export const now = () => Math.floor(Date.now() / 1000)

export function formatEvent (
  label    : string,
  payload  : string,
  template : EventTemplate
) : EventTemplate {
  return {
    ...template,
    content : JSON.stringify([ label, payload ]),
  }
}

export function parseEvent (
  event : Event
) : any[] {
  const arr = JSON.parse(event.content)
  if (!Array.isArray(arr) || arr.length < 2) {
    throw new TypeError('Invalid content payload!')
  }
  return arr
}

export function signEvent (
  template : EventTemplate,
  secret   : string
) : Event {
  const pubkey    = getPublicKey(secret)
  const unsigned  = { ...template, pubkey }
  const id  = getEventHash(unsigned)
  const sig = getSignature(unsigned, secret)
  return { ...unsigned, id, sig }
}

export function verifyEvent(
  event : Event
) : void {
  validateEvent(event)
  if (!verifySignature(event)) {
    throw new Error('Invalid signature!')
  }
}

export function is_author (
  event  : Event,
  pubkey : string
) {
  return event.pubkey === pubkey
}
