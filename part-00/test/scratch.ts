import WebSocket from 'isomorphic-ws'

const now = () => Math.floor(Date.now() / 1000)

const socket = new WebSocket('wss://relay.damus.io')

socket.on('open', () => {
  console.log('connected!')
  const subid  = '1234567890'
  
  const filter = {
    kinds : [ 1 ],
    since : now()
  }

  socket.send(JSON.stringify(['REQ', subid, filter ]))
})

socket.on('message', (msg) => {
  if (msg instanceof Uint8Array) {
    msg = msg.toString()
  }

  try {
    const envelope = JSON.parse(msg)

    if (envelope[0] === 'EVENT') {
      console.log('event:', envelope[2])
    } else {
      console.log('relay:', envelope)
    }

  } catch (err) {
    console.log('error:', msg)
  }
})

// const event = {}

// setTimeout( () => {
//   socket.send(JSON.stringify([ 'EVENT', event ]))
// }, 1000)
