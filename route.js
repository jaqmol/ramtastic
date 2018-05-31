import {
  // pipe,
  curry,
  isNil,
  ifElse,
  always,
} from 'ramda'
import {
  set,
} from 'ramtastic'

import createRouter from 'router5'
import browserPlugin from 'router5/plugins/browser'

const browserConfig = {
  useHash: true
}

let statePath = null
let routerInstance = null

const plugin = () => ({
  onTransitionSuccess: set(statePath)
})

const init = ifElse(
  always(() => isNil(routerInstance)),
  curry((path, routes) => {
    statePath = path
    routerInstance = createRouter(routes)
      .usePlugin(browserPlugin(browserConfig))
      .usePlugin(plugin)
      .start()
  }),
  () => { throw new Error('Router already initialized') },
)

const navigate = (name, params, options) => {
  routerInstance.navigate(name, params, options)
}

export { init, navigate }
