
import {fooFunction, fooClosure, konst, triple, SomeObject} from "./jsDocModule.js"

// idea shortcuts:
// Shift-Alt I   : inspection window (errors, warning)
// Cmd-Shift-I   : quick show implementation
// Ctrl-J        : jsdoc quick lookup
// Cmd-Hover     : quick info
// Cmd-P         : parameter info
// Ctrl-Shift-P  : expression type

const a1 = fooFunction(10) + 1;
const a2 = fooFunction(10).length; // this should be marked as suspicious

const f42 = konst(42);

const a3 = f42("öalsj") === 42;

const a4 = triple(1)(2)('foo');

const someObject = SomeObject(1);

someObject.setArg(2);   // flow typing
someObject.getArg();