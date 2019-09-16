let _out = (...args) => console.log(...args)

/**
 * Change the text output method.
 *
 * @param {function} val new text output function. Needs to accept the sual
 * console.log like arguments.
 */
export const set = (val) => {
  _out = val
}

/**
 * Let other code not worry about where normal human info text goes.
 *
 * This is not a replacement for debug, this is specifically for the ui.text
 * module.
 *
 * @param {...object} args any usual console.log like object.
 *
 */
export const out = (...args) => _out(...args)

export default out
