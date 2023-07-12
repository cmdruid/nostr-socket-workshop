type EventFn    = (...args : any[]) => void | Promise<void>
type EventSubs  = Set <EventFn>
type EventStore = Map <string, EventSubs>

export class EventEmitter {
  readonly _events : EventStore

  constructor () { this._events = new Map() }

  _get (topic : string) : EventSubs {
    /* Fetch the set for a given event. */
    let subs = this._events.get(topic)
    // If a set is undefined:
    if (subs === undefined) {
      // Create a new set.
      subs = new Set()
      // Add the set to the store.
      this._events.set(topic, subs)
    }
    // Return the set.
    return subs
  }

  has (topic : string) : boolean {
    /* Check if a topic exists in the store. */
    const res = this._events.get(topic)
    return (res instanceof Set && res.size > 0)
  }

  on (topic : string, fn : EventFn) : void {
    /* Subscribe a method to run on a given event. */
    this._get(topic).add(fn)
  }

  once (topic : string, fn : EventFn) : void {
    /* Subscribe a method to run once, using
     * a callback to cancel the subscription.
     */
    const onceFn = (...args : any[]) : void => {
      this.delete(topic, onceFn)
      void fn.apply(this, args)
    }
    this.on(topic, onceFn)
  }

  within (
    topic   : string,
    fn      : EventFn, 
    timeout : number
  ) : void {
    /* Subscribe a method to run within a given
     * time window, then cancel the subscription.
     */
    const withinFn = (...args : any[]) : void => {
      void fn.apply(this, args)
    }
    setTimeout(() => {
      this.delete(topic, withinFn)
    }, timeout)
    this.on(topic, withinFn)
  }

  emit (topic : string, ...args : any[]) : void {
    /* Emit an event topic, with arguments. */
    const methods : any[] = []
    // For each method subscribed to topic:
    this._get(topic).forEach(fn => {
      // Push method to array.
      methods.push(fn.apply(this, args))
    })
    // For each method subscribed to all (*):
    this._get('*').forEach((fn) => {
      // Push method to array.
      methods.push(fn.apply(this, [ topic, ...args ]))
    })
    // Run all methods.
    void Promise.allSettled(methods)
  }

  delete (topic : string, fn : EventFn) : void {
    /* Remove a method from the topic set. */
    this._get(topic).delete(fn)
  }

  clear (topic : string) : void {
    /* Clear all methods for a given topic. */
    this._events.delete(topic)
  }
}
