# NostrSocket Workshop

This workshop is an introduction to development using the nostr protocol.

We will be building an example project called `NostrSocket`, which communicates using a virtual socket over the nostr network.

## Overview

This demo project is broken down into 4 parts:

### Part 0: The Boilerplate

In this section, we cover setting up the project from scratch, plus review the boilerplate code that we are starting with.

 * Git clone repo.
 * Make sure node is up-to-date (v19).
 * Install all dependencies.
 * Review boilerplate code.

### Part 1: Subscribe to Events

In this section, we demonstrate how to connect to a relay and request events using the `nostr-tools` library.

 * Connecting to a relay pool.
 * Subscribe and listen to events.
 * Log the responses to console.

### Part 2: Sign and Publish Events

In this section, we will publish our own notes to a relay. We'll also cover the use of hashing, digital signatures, and signing devices.
 * Craft a note for publishing.
 * Sign and publish notes to the pool.
 * Parse and validate the response.

### Part 3: Create an Encrypted Channel

In this section, we will add encryption to our messages, and cover how to tag and filter those messages.

 * Setup our `encrypt` and `decrypt` methods. 
 * Adjust filter to subscribe to tagged events.
 * Adjust publisher to encrypt and tag events.
 * Adjust handler to decrypt the tagged responses.

### Part 4: Add an EventEmitter API.

In this section, we will complete our socket by adding a basic EventEmitter API, then move our traffic into the emitter. As a bonus, we will cover publishing our library to a package manager, and importing it onto different machines.

 * Extend a basic EventEmitter class.
 * Forward events from nostr to event emitter.
 * Compile, bundle and publish our library.
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
cd part_00
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

**Nostr Watch**  
https://nostr.watch  

**nostr.band**  
https://nostr.band  

## Contact

You can find me on twitter at `@btctechsupport` or on nostr at `npub1gg5uy8cpqx4u8wj9yvlpwm5ht757vudmrzn8y27lwunt5f2ytlusklulq3`
