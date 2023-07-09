import { Field, Point, sha256, util } from '@cmdcode/crypto-utils'

console.log(`
             Discreet Logarithm Cheat Sheet

                     Number Fields
            <-- We can div, sub, add, mul -->
        
Sign   : sig_int  = (sec_int * msg_int) + nonce_int

      | | |  fields can convert to points   x x x
      v v v  points can't convert to fields | | |

Verify : nonce_pt = (pub_pt * msg_pt) - sig_pt

              x-- We can neg, add, mul -->
                     Curve Points

For a given pub and msg:
  - The holder of sec_int can produce sig_int and nonce_int.
  - Anyone can verify that sig_int contains your pub, msg, and nonce.
`)

// Create a random 32-byte key.
const alice_secret = Field.mod(util.random(32))
// Convert that key into a point on the curve.
const alice_pubkey = Point.generate(alice_secret)

// The secret key should be kept secret!
console.log('alice seckey :', alice_secret.hex)
// The public key is the x coordinate of our point.
console.log('alice pubkey :', alice_pubkey.x.hex)
// If you want to see the entire point value:
console.log('alice_point  :', alice_pubkey._p)

// Let's have alice sign a message.
const message = 'I am feeling fat and sassy today.'
// Convert the string into bytes.
const encoded = new TextEncoder().encode(message)
// Run those bytes through a hashing algorithm.
const hashed  = sha256(encoded)
// Our hashed message:
console.log('message hash :', hashed.hex)

// To avoid leaking our secret, we'll add 
// a second one-time secret, called a nonce.
const nonce_sec = Field.mod(util.random(32))
// This nonce value also gets a point on the curve.
const nonce_pub = Point.generate(nonce_sec)
// We multiply our secret by the hash, then add the nonce.
const signature = alice_secret.mul(hashed).add(nonce_sec)
// We provide the result with our public nonce as a proof.
console.log('s value      :', signature.hex)
console.log('R value      :', nonce_pub.x.hex)

// To verify our signature, we also
// convert it to a point on the curve.
const sig_pub = Point.generate(signature)
// If we multiply our pubkey by the hash, then subtract
// the signature value, the result is our public nonce.
const sig_proof = alice_pubkey.mul(hashed).sub(sig_pub)
// The result should match the public nonce (R) value:
console.log('sig proof    :', sig_proof.x.hex)
