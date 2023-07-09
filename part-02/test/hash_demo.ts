import { Buff }   from '@cmdcode/buff-utils'
import { sha256 } from '@cmdcode/crypto-utils'

const items_a  = Buff.str('cheese, crackers, pepperoni')
const items_b  = Buff.str('cheese, crackers, pepperino')

const digest_a = sha256(items_a)
const digest_b = sha256(items_b)

console.log(`
## Any small change will produce a completely different hash:

  items_a  : ${items_a.str}
  digest_a : ${digest_a.hex}

  items_b  : ${items_b.str}
  digest_b : ${digest_b.hex}
`)

const text_blob = Buff.hex('deadbeef'.repeat(2048))
const digest_c  = sha256(text_blob)

console.log(`
## A large copy of data can be represented as a 32-byte hash:

  digest_c : ${digest_c.hex}
`)

// As specified in NIP-01:
// https://github.com/nostr-protocol/nips/blob/master/01.md

const event = {
  content    : 'My temperature is 64.757ºC',
  created_at : 1688886886,
  id         : '37fa9f74148c76f2e36dd278bc749dc746e61955c3e86d38e252442703ea5cdb',
  kind       : 1,
  pubkey     : 'fd6f1cb5161279c5befc8f76fb5339c2c4c24b42f2d3998c988324f2e4230086',
  sig        : '26233cbc387994553543ddc9266942b33942970f3682af2ba5b57799c0897400f560ed6f6e846e9a91cfb7158d00140b753f098f6dece8c27e1abe3ba8396dc5',
  tags       : []
}

const proof = [
  0,
  event.pubkey,
  event.created_at,
  event.kind,
  event.tags,
  event.content
]

const hash = sha256(Buff.json(proof))

console.log(`
## We can take any nostr event and compute its id:

${JSON.stringify(event, null, 2)}

## The format of the id preimage (as specified in NIP-01):

  [
    0,
    <pubkey, as a (lowercase) hex string>,
    <created_at, as a number>,
    <kind, as a number>,
    <tags, as an array of arrays of non-null strings>,
    <content, as a string>
  ]

## The actual preimage:

${JSON.stringify(proof, null, 2)}

## The resulting sha256 hash:
  event id : ${event.id}
  sha hash : ${hash.hex}
`)
