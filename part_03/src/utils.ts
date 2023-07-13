import {
  Event,
  EventTemplate,
  getEventHash,
  validateEvent,
  verifySignature
} from 'nostr-tools'

// Get the current UTC time, in seconds.
export const now = () => Math.floor(Date.now() / 1000)

export function format_event (
  topic    : string,
  payload  : string,
  template : EventTemplate
) : EventTemplate {
  /* Convert our event payload into JSON, then
   * then return it wrapped in an event template.
   */
  return {
    ...template,
    content : JSON.stringify([ topic, payload ]),
  }
}

export function parse_event (
  event : Event
) : any[] {
  /* Parse an incoming signed event, and try to
   * convert the content back into a JSON object.
   */
  const arr = JSON.parse(event.content)
  if (!Array.isArray(arr) || arr.length < 2) {
    throw new TypeError('Invalid content payload!')
  }
  return arr
}

export function verify_event(
  event : Event
) : void {
  /* Assert that an incoming signed event
   * is valid, and the signature is authentic.
   */
  validateEvent(event)
  if (getEventHash(event) !== event.id) {
    throw new Error('Event ID is invalid!')
  }
  if (!verifySignature(event)) {
    throw new Error('Event signature is invalid!')
  }
}
