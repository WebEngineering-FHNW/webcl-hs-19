/**
 *
 * @module A module to see how jsdoc effects the use of javascript
 * @see {@link ./jsDocModuleUse.js} for usage of this module
 * @export fooFunction (add info on export purposes)
 */

export { fooFunction, fooClosure, konst, triple, SomeObject }

/**
 * Generic Types
 * @typedef {*} a
 * @typedef {*} b
 * @typedef {*} c
 * @typedef {(a|b|c)} abc
 */

/**
 * foo is the identity function
 * @param   {a} x
 * @returns {a} {@link x}
 */
function fooFunction(x) { return x;}

/**
 * a -> a ; identity
 * @param   {a} x
 * @returns {a} {@link x}
 */
const fooClosure = x => x;

/**
 * a -> b -> a ; curried style
 * @param {a} x
 * @returns {function({b}): {a}} a function that ignores its argument and returns {@link x}
 */
const konst = x => y => x;

/**
 * a -> b -> c -> (a,b,c) ; curried triplet
 * @returns {function(b): function(c): {abc}[]}
 */
const triple =
        /** a */ x =>
        /** b */ y =>
        /** c */ z => [x,y,z];

/**
 * Just Some Object with a getter and setter
 * @param {a} someArg
 * @returns {{setArg: (function({a}): {a}), getArg: (function(): {a})}}
 * @constructor
 */
const SomeObject = someArg => {
    return {
        getArg : () => someArg,
        setArg : val => someArg = val
    }
};