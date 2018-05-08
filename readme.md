# Ramtastic

> *Ramda + Snabbdom = Fantastic*

**Point-free programming for frontend-applications.** Based on [Ramda](http://ramdajs.com) and [Snabbdom](https://github.com/snabbdom/snabbdom).

Inspired by [Redux](https://redux.js.org) and [functional React components](https://reactjs.org/docs/components-and-props.html#functional-and-class-components), but with an edge towards lenses.

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

## This project is in a very early stage of development

Contributors welcome! I'm myself quite new to Ramda, so feel free to jump in.

[RAMTASKS is the practical test project](https://github.com/jaqmol/ramtasks) under which ramtastic is developed.

## Unordered ideas:

- CLI "ram", something in the line of react-scripts
- CLI options:
  - add dependencies and scripts to existing project
  - create components
  - create containers (with selection from a list of existing components)
  - create actions (ramtastic doesn't need reducers)
  - translate HTML to snabbdom
- Parcel
- Usage documentation

## RamdaJS

> A practical functional library for JavaScript programmers.

[Ramda Documentation](http://ramdajs.com/docs)

## Snabbdom

> A virtual DOM library with focus on simplicity, modularity, powerful features and performance.

[Snabbdom on GitHub](https://github.com/snabbdom/snabbdom)
