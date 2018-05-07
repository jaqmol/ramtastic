import {
  vnode1 as n1,
  vnode2 as n2,
  vnode3 as n3,
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
} from 'ramda'
import h from 'snabbdom/h'
import testData from './test-data'

test('flat vn test', () => {
  const checkbox = n2('input', {props: {type: 'checkbox'}})
  const resultA = checkbox()
  const resultB = h('input', {props: {type: 'checkbox'}})
  expect(resultA).toEqual(resultB)
})

test('nested vn test', () => {
  const listitem = n3('li.list-item', {}, [
    n3('label', {}, [
      n2('input', {props: {type: 'checkbox'}}),
      'Text',
    ]),
    n2('button', {}),
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
  const listitem = n3('li.list-item', {}, [
    n3('label', {}, [
      n2('input', pipe(
        propOr(false, 'checked'),
        assocPath(
          path('props.checked'),
          __,
          {props: {type: 'checkbox'}},
        )
      )),
      prop('text'),
    ]),
    n3('button', {}, 'X'),
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
  const input = n2('input', pipe(
    propOr(false, 'checked'),
    assocPath(
      path('props.checked'),
      __,
      {props: {type: 'checkbox'}},
    )
  ))
  const label = n3('label', {}, [
    input,
    prop('text'),
  ])
  const button = n3('button', {}, 'X')
  const listItem = n3('li.list-item', {}, [
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
  const listItem = n3('li.list-item', {}, prop('text'))
  const list = n3('ul.list', {}, map(listItem))
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
  const listItem = n3('li.list-item', {}, prop('text'))
  const list = n3('ul.list', {}, map(listItem))
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
