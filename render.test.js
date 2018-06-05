import {
  pipe,
  forEach,
  times,
  ifElse,
  unapply,
  identity,
  always,
  map,
  is,
  unless,
  juxt,
  not,
  equals,
  repeat,
  concat,
  zip,
  forEach,
  split,
  head,
  find,
  filter,
  join,
  length,
} from 'ramda'

let _elementFn = null
let _renderFn = null
let _removeSubscriber = null
let _rootVnode = null


function _inequal (oldValue, newValue) {
  return not(equals(oldValue, newValue))
}

function _equalizeLength (prevCont, nextCont) {
  const fill = (arr, amount) => concat(arr, repeat(null, amount))
  const oldLen = prevCont.length
  const newLen = nextCont.length
  if (oldLen < newLen) {
    prevCont = fill(prevCont, newLen - oldLen)
  }
  if (oldLen > newLen) {
    nextCont = fill(nextCont, oldLen - newLen)
  }
  return [prevCont, nextCont]
}

function _patchSelector(prevVn, nextVn) {
  const splitSel = split(/(?=[#\.])/)
  const prevComps = splitSel(prevVn.selector)
  const nextComps = splitSel(nextVn.selector)
  const tag = head(nextComps)
  if (head(prevComps) !== tag) {
    const prevElem = prevVn.element
    const nextElem = document.createElement(tag)
    while (prevElem.hasChildNodes()) {
      nextElem.appendChild(prevElem.firstChild)
    }
    nextVn.element = nextElem
  } else {
    nextVn.element = prevVn.element
  }
  const element = nextVn.element
  const nextId = find(c => c.indexOf('#') === 0, nextComps)
  if (nextId) {
    element.id = nextId.slice(1)
  }
  const classNames = map(c => c.slice(1), filter(c => c.indexOf('.') === 0, nextComps))
  if (length(classNames)) {
    element.className = join(' ', classNames)
  }
}

function _patchParameters(prevVn, nextVn) {
  // TODO: continue here
}

function _patchContents(prevVn, nextVn) {
  // TODO: handling of non-VNode instance contents
  const [prevCont, nextCont] = _equalizeLength(prevVn.contents, nextVn.contents)
  forEach(apply(_patch), zip(prevCont, nextCont))
}

function _patch (preVn, nextVn) {
  const selsInequal = _inequal(preVn.selector, nextVn.selector)
  const paramsInequal = _inequal(preVn.parameters, nextVn.parameters)
  if (selsInequal) {
    _patchSelector(preVn, nextVn)
    _patchParameters(preVn, nextVn)
  } else if (!selsInequal && paramsInequal) {
    _patchParameters(preVn, nextVn)
  }
  _patchContents(preVn, nextVn)
  return nextVn
}

const _rootPatch = () => {
  _rootVnode = _patch(_rootVnode, _renderFn())
}

const ensureFn = arg => typeof arg === 'function'
  ? arg
  : () => arg

const ensureArrOfFns = arg => {
  const arr = !(arg instanceof Array) ? [arg] : arg
  return arr.map(ensureFn)
}

function VNode (
    selector=null,
    parameters=null,
    contents=null,
    element=null
) {
  this.selector = selector
  this.parameters = parameters
  this.contents = contents
  this.element = element
}

const vnode = (selector, parameters=null, contents=null) => {
  const parametersFn = ensureFn(parameters)
  const contentsFns = ensureArrOfFns(contents)
  return (...args) => {
    const renderParams = parametersFn(...args)
    const renderContents = contentsFns.map(fn => fn(...args))
    return new VNode(selector, renderParams, renderContents)
  }
}

const queryFn = selector => () => document.querySelector(selector)

const init = (elementFn, renderFn) => {
  if (!_removeSubscriber) {
    _removeSubscriber = subscribe(path('*'), _patch)
  }
  _elementFn = elementFn
  _renderFn = renderFn
  _rootVnode = new VNode(null, null, null, _elementFn())
}

test('new vnode creation', () => {
  const render = vnode('div.emphasize')
  const vn = render({payload: 'data'})
  console.log(vn)
})
