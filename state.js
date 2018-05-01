import {
  path as rPath,
  pathOr,
  prop,
  propOr,
  assocPath,
  assoc,
  forEach,
  split,
  join,
  append,
  prepend,
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
  apply,
  reverse,
  unapply,
  converge,
  identity,
  nthArg,
  head,
  adjust,
} from 'ramda'

let _state = null
let _subscribers = {}

// side-effect dependent private functions:

const state = () => _state
const statePathOr = (fallback, path) => pathOr(fallback, path, _state)
const stateAssocPath = (path, value) => {
  _state = assocPath(path, value, _state)
}
const subscribersAssoc = (pointer, subscriber) => {
  _subscribers = assoc(
    pointer,
    append(subscriber, propOr([], pointer, subscriber)),
    _subscribers
  )
}
const subscriberRemover = (pointer, subscriber) => () => {
  _subscribers = assoc(
    pointer,
    reject(identical(subscriber), prop(pointer, _subscribers)),
    _subscribers
  )
}

// private functions

const dispatch = pipe(
  unapply(identity),
  converge(prepend, [
    pipe(
      head,
      join('.'),
      ifElse(
        equals('*'),
        always(['*']),
        flip(append)(['*']),
      ),
    ),
    identity
  ]),
  apply((pointers, path, value, old) => forEach(
    pointer => forEach(
      sfn => sfn(path, value, old),
      propOr([], pointer, _subscribers)
    ),
    pointers,
  )),
)

// public functions

const init = value => {
  const old = _state
  _state = value
  dispatch(['*'], value, old)
}
const path = split('.')

const getOr = ifElse(
  pipe(nthArg(1), join('.'), equals('*')),
  state,
  statePathOr,
)
const get = getOr(null)

const set = pipe(
  unapply(identity),
  converge(append, [pipe(head, get), identity]),
  ifElse(
    pipe(reverse, apply(equals)),
    F,
    pipe(
      tap(apply(stateAssocPath)),
      apply(dispatch),
      T,
    ),
  )
)

const subscribe = pipe(
  unapply(identity),
  adjust(join('.'), 0),
  tap(apply(subscribersAssoc)),
  apply(subscriberRemover),
)

export { init, path, set, get, getOr, subscribe }
