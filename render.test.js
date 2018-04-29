import {
  init as initRender,
  queryFn,
} from './render'
import {
  init as initState,
  get,
  set,
  path,
} from './state'
import h from 'snabbdom/h'

const resetAppDiv = () => {
  document.body.innerHTML = '<div id="app"></div>'
}

const greetingComponent = text => h('h1', `Hello ${text}!`)
const greetingContainerFn = p => () => greetingComponent(get(p))

test('render on setting state path', () => {
  resetAppDiv()
  const p = path('hello')
  const container = greetingContainerFn(p)
  initRender(queryFn('#app'), container)
  set(p, 'On Set')
  expect(document.body.innerHTML).toEqual('<h1>Hello On Set!</h1>')
})

test('render on initializing state', () => {
  resetAppDiv()
  const p = path('hello')
  const container = greetingContainerFn(p)
  initRender(queryFn('#app'), container)
  initState({ hello: 'On Init' })
  expect(document.body.innerHTML).toEqual('<h1>Hello On Init!</h1>')
})
