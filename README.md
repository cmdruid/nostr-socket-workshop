# NostrSocket Workshop

This repo is an introduction to development using the nostr protocol.

We will be building an example project called `NostrSocket`, which is a very practical library for performing machine-to-machine communications using a virtual socket over the nostr network.

## Overview

This demo project is broken down into 4 parts:

### Part 0: The Boilerplate

In this section, we will cover setting up the project from scratch, plus review the boilerplate code that we are starting with. As a bonus, we'll also briefly cover connecting to a nostr relay from a basic `WebSocket` object.

 * Git clone repo.
 * Make sure node is up-to-date.
 * Install all dependencies.
 * Insert boilerplate configs.

### Part 1: Subscribe to Events

In this section, we will demonstrate how to connect to a relay and request events using the `nostr-tools` library.

 * Connecting to a relay pool.
 * Subscribe and listen to events.
 * Log the responses.

### Part 2: Sign and Publish Events

In this section, we will demonstrate how to publish our own notes to a relay. We'll also cover the use of a signing device, and the concept of using public keys as our identity on nostr.

 * Craft a note for publishing.
 * Sign and publish notes to the pool.
 * Validate and parse the response.

### Part 3: Create an Encrypted Channel

In this section, we will add encryption to our messages, and cover how to tag and filter those messages.

 * Setup our `encrypt` and `decrypt` methods. 
 * Adjust filter to subscribe to tagged events.
 * Adjust publisher to encrypt and tag events.
 * Adjust handler to decrypt the responses.

### Part 4: Add an Events API.

In this section, we will complete our project by adding a basic EventEmitter API, then piping our event traffic into the emitter. This will complete the course and provide us with a virtual websocket that we can use to communicate between machines.

 * Extend a basic EventEmitter class.
 * Forward events from nostr to event bus.
 * Handle the echo of our own events.
 * Wrap-up and demonstration of `NostrSocket`.

## Setup

To begin, use `git clone` to download this repo onto your local machine.

```bash
# Clone the repo onto your machine
git clone https://github.com/cmdruid/nostr-socket-workshop
# Enter the project directory.
cd nostr-socket-workshop
```

Once downloaded, enter the project directory, then enter any lesson step to follow along. You will have to install dependencies for each step by running `yarn install` or `npm install` when you first begin the lesson.

```bash
## Enter the directory of a lesson.
cd part-00
## Install any dependencies.
npm install
## Run the example scratch file.
npm run scratch
```

## Questions / Issues

Please feel free to post an issue of you have any questions, or need clarification on something here.

## Resources

**Nostr Implementation Proposals**  
https://nips.be  
https://github.com/nostr-protocol/nips  

**nostr-tools**  
https://github.com/nbd-wtf/nostr-tools

**nostr army knife**  
https://nak.nostr.com

**nostr watch**  
https://nostr.watch  

**nostr.band**  
https://nostr.band  

## Contact

You can find me on twitter at `@btctechsupport` or on nostr at `npub1gg5uy8cpqx4u8wj9yvlpwm5ht757vudmrzn8y27lwunt5f2ytlusklulq3`
