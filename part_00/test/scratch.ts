import { now } from '../src/utils.js'

const time = now()

console.log('The current UTC time is:', time)

console.log(new Date(time * 1000))
