import {
  init,
  path,
  set,
  get,
  getAll,
  getOr,
  subscribe,
} from './state'

const testState = {
  Archaeplastida: {
    Glaucophyta: {},
    Rhodophyta: {},
    Algae: {
      Mesostigmatophyceae: {},
      Chlorokybophyceae: {},
      Chlorophyta: {},
      Streptophyta: {
        Charales: {},
        Embryophyte: {},
      },
    },
  },
}

const Chlorophyta = {
  Palmophyllophyceae: {
    Prasinococcales: {},
    Palmophyllales: {},
    Pyramimonadophyceae : {},
    Mamiellophyceae: {},
    Nephroselmidophyceae: {
      Picocystophyceae: {},
    },
  },
}

test('get path', () => {
  init(testState)
  const r = get(path('Archaeplastida.Algae.Streptophyta'))
  expect(r).toEqual({ Charales: {}, Embryophyte: {} })
})

test('get all paths array', () => {
  init(testState)
  const allPaths = [
    path('Archaeplastida.Glaucophyta'),
    path('Archaeplastida.Rhodophyta'),
    path('Archaeplastida.Algae.Streptophyta'),
  ]
  const rs = getAll(allPaths)
  expect(rs).toEqual([ {}, {}, { Charales: {}, Embryophyte: {} } ])
})

test('get all paths object', () => {
  init(testState)
  const allPaths = {
    glauco: path('Archaeplastida.Glaucophyta'),
    rhodo: path('Archaeplastida.Rhodophyta'),
    strepto: path('Archaeplastida.Algae.Streptophyta'),
  }
  const rs = getAll(allPaths)
  expect(rs).toEqual({
    glauco: {},
    rhodo: {},
    strepto: {
      Charales: {},
      Embryophyte: {}
    }
  })
})

test('get complete state', () => {
  init(testState)
  const r = get(path('*'))
  expect(r).toEqual(testState)
})

test('set path', () => {
  init(testState)
  expect(get(path('a.b.c'))).toBe(null)
  const p = path('Archaeplastida.Algae.Chlorophyta')
  const r1 = get(p)
  expect(r1).toEqual({})
  set(p, Chlorophyta)
  const r2 = get(p)
  expect(r2).toEqual(Chlorophyta)
})

test('subscribing to a path', done => {
  init(testState)
  const cp = path('Archaeplastida.Algae.Chlorophyta')
  const clear = subscribe(cp, (sp, value, old) => {
    expect(cp).toEqual(sp)
    expect(old).toEqual({})
    expect(value).toEqual(Chlorophyta)
    done()
  })
  set(cp, Chlorophyta)
  clear()
})

test('subscribing to all changes', done => {
  init(testState)
  const cp = path('Archaeplastida.Algae.Chlorophyta')
  const clear = subscribe(path('*'), (sp, value, old) => {
    expect(cp).toEqual(sp)
    expect(value).toEqual(Chlorophyta)
    done()
  })
  set(cp, Chlorophyta)
  clear()
})
