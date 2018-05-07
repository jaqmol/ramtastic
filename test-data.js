import {
  pipe,
  repeat,
  map,
} from 'ramda'

const sourceData = [
  { text: 'Giraffe' },
  { text: 'Elephant' },
  { text: 'Antelope' },
  { text: 'Bushbaby' },
  { text: 'Cheetah' },
  { text: 'Bonobo' },
  { text: 'Crocodile' },
  { text: 'Gorilla' },
  { text: 'Hippo' },
  { text: 'Hyena' },
  { text: 'Jackal' },
  { text: 'Leopard' },
  { text: 'Lion' },
  { text: 'Mongoose' },
  { text: 'Monkey' },
  { text: 'Okapi' },
  { text: 'Ostrich' },
  { text: 'Pangolin' },
  { text: 'Rhino' },
  { text: 'Serval' },
  { text: 'Warthog' },
  { text: 'Wildebeest' },
  { text: 'Zebra' },
]

const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)]
const testData = pipe(repeat(sourceData), map(pickRandom))

export default testData
