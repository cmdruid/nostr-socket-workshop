import { Field, Point, sha256, util } from '@cmdcode/crypto-utils'

console.log(`
               Digital Signature Cheat Sheet

For certain number groups, the inverse for exponentiation
has no known efficient solution (discreet log problem).

                  Finite Number Fields
                -3 -2 -1  N  +1 +2 +3
              <-- div, sub, add, mul -->

    | | |  we _can_ compute field num to a point  x x x
    v v v  we can't reverse a point to field num  | | |

              x-- ___, neg, add, mul -->
                __ __ -1  P  +1 +2 +3
                Elliptic Curve Pointsu const invoicePolling = useSelector((state) => state.polling);
  const connected = useSelector((state) => state.connected);
  const txid = useSelector((state) => state.txid);
  const paid = useSelector((state) => state.paid);



We can exploit this asymmetry to create a math proof which can be
verified without revealing a secret num (zero-knowledge proof).

Sign   : sig_num   = (sec_num * msg_num + nonce_num) % N
Verify : nonce_pnt = (pub_pnt * msg_pnt - sig_pnt  ) % P

For a given secret num and message:

  - The holder of sec_num can produce a sig_num using a
    given msg_key and random nonce_num / nonce_pnt.

  - It is trivial to compute msg_num into msg_pnt and
    sig_num into sig_pnt.

  - Anyone can verify that sig_pnt is the solution to 
    pub_pnt * msg_pnt + nonce_pnt.

  - However it is infeasible to revert pub_pnt and nonce_pnt
    into sec_num and nonce_num, keeping them both secret.
`)

// Create a random 32-byte secret key.
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
