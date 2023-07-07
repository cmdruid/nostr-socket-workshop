# Machine to Machine

This repo is an introduction to development using the nostr protocol.

We will be building an example project called `NostrSocket`, which is a very practical library for performing peer-to-peer communications using a virtual socket over the nostr network.

## Overview

This project is broken down into 4 basic parts.

### Part 0: Setup environment
 * Git clone repo.
 * Make sure node is up-to-date.
 * Install all dependencies.
 * Insert boilerplate configs.

### Part 1: Subscribing to events.
 * Connecting to a relay pool.
 * Subscribe and listen to events.
 * Log the responses.

### Part 2: Publishing a message
 * Craft a note for publishing.
 * Sign and publish notes to the pool.
 * Validate and parse the response.

### Part 3: Setting up a channel.
 * Setup our `encrypt` and `decrypt` methods. 
 * Adjust filter to subscribe to tagged events.
 * Adjust publisher to encrypt and tag events.
 * Adjust handler to decrypt the responses.

### Part 4: Create a NostrSocket class.
 * Extend a basic EventEmitter class.
 * Forward events from nostr to event bus.
 * Handle the echo of our own events.
 * Wrap-up and demonstration of `NostrSocket`.

## Setup

```bash
git clone xxx
cd machine-to-machine
```

```bash
cd step-00
npm install
npm run scratch
```

## Questions / Issues

## Resources

nostr-tools
buff-utils

## Contact

npub
