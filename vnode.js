import {
  curry,
  nAry,
  is,
  ifElse,
  useWith,
  unapply,
  identity,
  pipe,
  mergeAll,
  always,
  map,
  of,
  objOf,
  __,
  juxt,
} from 'ramda'
import h from 'snabbdom/h'

const ensureSelector = objOf('sel')

const ensureFunction = ifElse(
  is(Function),
  identity,
  always,
)

const ensurePropertiesFn = pipe(
  ensureFunction,
  objOf('dataFn'),
)

const ensureContentsFn = pipe(
  ifElse(
    is(Array),
    pipe(
      map(ensureFunction),
      juxt,
    ),
    ensureFunction,
  ),
  objOf('childrenFn'),
)

const vnode3 = useWith(
  pipe(
    unapply(identity),
    mergeAll,
    c => (...a) => h(
      c.sel,
      c.dataFn(...a),
      c.childrenFn(...a),
    ),
  ),
  [
    ensureSelector,
    ensurePropertiesFn,
    ensureContentsFn,
  ],
)

const vnode1 = vnode3(__, {}, null)
const vnode2 = vnode3(__, __, null)

export { vnode1, vnode2, vnode3 }
