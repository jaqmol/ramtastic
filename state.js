import {
  path as rPath,
  pathOr,
  prop,
  propOr,
  assocPath,
  assoc,
  curry,
  compose,
  forEach,
  split,
  join,
  append,
  reject,
  identical,
  ifElse,
  equals,
  F,
  tap,
  pipe,
  T,
  always,
  flip,
} from 'ramda'

let _state = null
let _subscribers = {}

const _assocPointer = o => assoc('pointer', join('.', o.path), o)
const _getOr = {
  pointerEqualsGlob: ({pointer}) => equals('*', pointer),
  completeState: () => _state,
  stateAtPath: ({fallback, path}) => pathOr(fallback, path, _state),
}
const _set = {
  assocOld: o => assoc('old', rPath(o.path, _state), o),
  oldEqualsValue: ({value, old}) => equals(value, old),
  assocState: tap(({path, value}) => {
    _state = assocPath(path, value, _state)
  }),
  dispatch: ({path, value, old}) => forEach(
    pointer => forEach(
      s => s(path, value, old),
      propOr([], pointer, _subscribers)
    ),
    _set.dispatchPointers(path),
  ),
  dispatchPointers: pipe(
    join('.'),
    ifElse(
      equals('*'),
      always(['*']),
      flip(append)(['*']),
    ),
  )
}
const _subscribe = {
  assocSubscriber: tap(({ pointer, subscriber }) => {
    _subscribers = assoc(
      pointer,
      append(subscriber, propOr([], pointer, subscriber)),
      _subscribers
    )
  }),
  removeFn: ({ pointer, subscriber }) => () => {
    _subscribers = assoc(
      pointer,
      reject(identical(subscriber), prop(pointer, _subscribers)),
      _subscribers
    )
  },
}

const init = value => {
  const old = _state
  _state = value
  _set.dispatch({path: ['*'], value, old})
}
const path = split('.')
const getOr = curry(pipe(
  (fallback, path) => ({fallback, path}),
  _assocPointer,
  ifElse(
    _getOr.pointerEqualsGlob,
    _getOr.completeState,
    _getOr.stateAtPath,
  )
))
const get = getOr(null)
const set = curry(pipe(
  (path, value) => ({ path, value }),
  _set.assocOld,
  ifElse(
    _set.oldEqualsValue,
    F,
    pipe(_set.assocState, _set.dispatch, T)
  )
))
const subscribe = curry(pipe(
  (path, subscriber) => ({ path, subscriber }),
  _assocPointer,
  _subscribe.assocSubscriber,
  _subscribe.removeFn,
))

export { init, path, set, get, getOr, subscribe }
