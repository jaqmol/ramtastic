# Ramtastic

> *Ramda + Snabbdom = Fantastic*

**Point-free programming for frontend-applications.** Based on [Ramda](http://ramdajs.com) and [Snabbdom](https://github.com/snabbdom/snabbdom).

Inspired by [Redux](https://redux.js.org) and [functional React components](https://reactjs.org/docs/components-and-props.html#functional-and-class-components), but with an edge towards lenses.

## [See Ramtasks,](https://github.com/jaqmol/ramtasks)
the practical test project. Though the project is quite new, it got functional and usable really quick due to Snabbdom and Ramda.

## Contribute
There's no intention to become the next React. It's just that Ramda is worth learning. And how to learn better than writing your own frontend-framework 😉

I'm myself new to the "Zen of Ramda", so feel free to complain or suggest: [Twitter handle: yaqmol](https://twitter.com/yaqmol)

## Key points:

### Components
- Components are pure functions that render VNodes
- Containers bind components to values of the state tree via paths

### Single Immutable State Tree
- There is a central immutable state tree
- Actions express mutations on the state tree
- Reducers are replaced by a lens-like value set and get mechanism

### State changes trigger rendering
- State-change-events on paths can be subscribed to
- Re-rendering is triggered automatically on state changes

## Unordered ideas:
- CLI "ram", something in the line of react-scripts
- CLI options:
  - add dependencies and scripts to existing project
  - create components
  - create containers (with selection from a list of existing components)
  - create actions (ramtastic doesn't need reducers)
  - translate HTML to snabbdom
- Usage documentation

## RamdaJS
> A practical functional library for JavaScript programmers.

[Ramda Documentation](http://ramdajs.com/docs)

## Snabbdom
> A virtual DOM library with focus on simplicity, modularity, powerful features and performance.

[Snabbdom on GitHub](https://github.com/snabbdom/snabbdom)
