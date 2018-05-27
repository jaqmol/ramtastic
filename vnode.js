import {
  ifElse,
  pipe,
  always,
  map,
  juxt,
  converge,
  identity,
  is,
} from 'ramda'
import h from 'snabbdom/h'

const ensureFunction = ifElse(
  is(Function),
  identity,
  always,
)

const ensureContentsFn = ifElse(
  is(Array),
  pipe(
    map(ensureFunction),
    juxt,
  ),
  ensureFunction,
)

const vnode = pipe(
  (sel, data={}, children=null) => [
    sel,
    ensureFunction(data),
    ensureContentsFn(children)
  ],
  ([sel, dataFn, childrenFn]) => converge(
    h,
    [
      always(sel),
      dataFn,
      childrenFn
    ]
  )
)

export { vnode }
