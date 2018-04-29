import {
  init as snbdmInit
} from 'snabbdom'
import {
  default as snbdmClass
} from 'snabbdom/modules/class'
import {
  default as snbdmProps
} from 'snabbdom/modules/props'
import {
  default as snbdmStyle
} from 'snabbdom/modules/style'
import {
  default as snbdmEventListeners
} from 'snabbdom/modules/eventlisteners'

import {
  curry,
  bind,
  always,
  when,
  tap,
  pipe,
} from 'ramda'
import {
  subscribe,
  path,
} from './state'

const _snbdmPatch = snbdmInit([
  snbdmClass,
  snbdmProps,
  snbdmStyle,
  snbdmEventListeners,
])

let _removeSubscriber = null
let _patch = null

const _init = {
  canRemoveSubscriber: () => !!_removeSubscriber,
  removeSubscriber: tap(() => _removeSubscriber()),
  renewPatch: ({elementFn, renderFn}) => {
    _patch = () => {
      let vnode = _snbdmPatch(elementFn(), renderFn())
      _patch = () => {
        vnode = _snbdmPatch(vnode, renderFn())
      }
    }
  },
  renewSubscription: () => {
    _removeSubscriber = subscribe(path('*'), () => _patch())
  },
}
const _docQuery = bind(document.querySelector, document)

const queryFn = selector => () => _docQuery(selector)
const init = curry(pipe(
  (elementFn, renderFn) => ({elementFn, renderFn}),
  when(_init.canRemoveSubscriber, _init.removeSubscriber),
  _init.renewPatch,
  _init.renewSubscription,
))

export { init, queryFn }
