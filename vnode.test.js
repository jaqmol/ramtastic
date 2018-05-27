import {
  vnode,
} from './vnode'
import {
  path,
} from './state'
import {
  pipe,
  propOr,
  prop,
  assocPath,
  __,
  map,
  forEach,
  repeat,
  times,
  binary,
} from 'ramda'
import h from 'snabbdom/h'
import testData from './test-data'

test('flat vn test', () => {
  const checkbox = vnode('input', {props: {type: 'checkbox'}})
  const resultA = checkbox()
  const resultB = h('input', {props: {type: 'checkbox'}})
  expect(resultA).toEqual(resultB)
})

test('nested vn test', () => {
  const listitem = vnode('li.list-item', {}, [
    vnode('label', {}, [
      vnode('input', {props: {type: 'checkbox'}}),
      'Text',
    ]),
    vnode('button', {}),
  ])
  const resultA = listitem()
  const resultB = h('li.list-item', {}, [
    h('label', {}, [
      h('input', {props: {type: 'checkbox'}}),
      'Text',
    ]),
    h('button', {}),
  ])
  expect(resultA).toEqual(resultB)
})

test('nested vn with state test', () => {
  const listitem = vnode('li.list-item', {}, [
    vnode('label', {}, [
      vnode('input', pipe(
        propOr(false, 'checked'),
        assocPath(
          path('props.checked'),
          __,
          {props: {type: 'checkbox'}},
        )
      )),
      prop('text'),
    ]),
    vnode('button', {}, 'X'),
  ])
  const data = {checked: true, text: 'Say hello!'}
  const resultA = listitem(data)
  const resultB = h('li.list-item', {}, [
    h('label', {}, [
      h('input', {props: {
        type: 'checkbox',
        checked: data.checked
      }}),
      data.text,
    ]),
    h('button', {}, 'X'),
  ])
  expect(resultA).toEqual(resultB)
})

test('vn composability', () => {
  const input = vnode('input', pipe(
    propOr(false, 'checked'),
    assocPath(
      path('props.checked'),
      __,
      {props: {type: 'checkbox'}},
    )
  ))
  const label = vnode('label', {}, [
    input,
    prop('text'),
  ])
  const button = vnode('button', {}, 'X')
  const listItem = vnode('li.list-item', {}, [
    label,
    button,
  ])
  const data = {checked: true, text: 'Say hello!'}
  const resultA = listItem(data)
  const resultB = h('li.list-item', {}, [
    h('label', {}, [
      h('input', {props: {
        type: 'checkbox',
        checked: data.checked
      }}),
      data.text,
    ]),
    h('button', {}, 'X'),
  ])
  expect(resultA).toEqual(resultB)
})

test('vn mappability', () => {
  const listItem = vnode('li.list-item', {}, prop('text'))
  const list = vnode('ul.list', {}, map(listItem))
  const data = testData(5)
  const resultA = list(data)
  const resultB = h(
    'ul.list',
    {},
    data.map(({text}) => h('li.list-item', {}, text)),
  )
  expect(resultA).toEqual(resultB)
})

test('vn multiple apply', done => {
  const listItem = vnode('li.list-item', {}, prop('text'))
  const list = vnode('ul.list', {}, map(listItem))
  const snabbHList = data => h(
    'ul.list',
    {},
    data.map(({text}) => h('li.list-item', {}, text)),
  )
  pipe(
    times(() => testData(11)),
    forEach(arr => {
      const resultA = list(arr)
      const resultB = snabbHList(arr)
      expect(resultA).toEqual(resultB)
    }),
    () => done(),
  )(11)
})
