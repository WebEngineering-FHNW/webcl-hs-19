// times utility

const timesFunction = function(callback) {
  if( isNaN(parseInt(Number(this.valueOf()))) ) {
    throw new TypeError("Object is not a valid number");
  }
  for (let i = 0; i < Number(this.valueOf()); i++) {
    callback(i);
  }
};

String.prototype.times = timesFunction;
Number.prototype.times = timesFunction;

// string utilities

// appends blanks to the right until the string is of size extend
// padRight :: String, Int -> String
function padRight(str, extend) {
    return "" + str + fill(str, extend);
}

// appends blanks to the left until the string is of size extend
// padLeft :: String, Int -> String
function padLeft(str, extend) {
    return "" + fill(str, extend) + str;
}

function fill(str, extend) {
    const len = str.toString().length; // in case str is not a string
    if (len > extend) {
        return "";
    }
    return " ".repeat(extend - len);
}

// rock-solid data structures


// ----------- Data structures

const Pair =
    first  =>
    second =>
    Object.seal( selector  => selector (first) (second) ); // seal to disallow using functions as objects

const fst = arg_1 => arg_2 => arg_1;
const snd = arg_1 => arg_2 => arg_2;

const Tuple = n => {
    if (n < 1) throw new Error("Tuple must have first argument n > 0");

    return [
        TupleCtor (n) ([]), // ctor curries all values and then waits for the selector
        // every selector is a function that picks the value from the curried ctor at the same position
        ...Array.from( {length:n}, (it, idx) => values => values[idx] )
    ];
};

const nApply = n => f => n === 0 ? f : ( g => nApply (n-1) (f (g) ));  // a curried functions that eats so many arguments

const Choice = n => { // number of ctors
    if (n < 1) throw new Error("Choice must have first argument n > 0");

    return [
        ...Array.from( {length:n}, (it, idx) => ChoiceCtor (idx + 1) (n + 1) ([]) ), // first arg is the ctor state
        choice => nApply (n) (choice)                                                // takes n + 1 args and returns arg[0] (arg[1]) (arg[2]) ... (arg[n])

    ];
};

// private implementation details ---------------------

const TupleCtor = n => values => {
    if (n === 0 ) {                                             // we have curried all ctor args, now
        return Object.seal(selector => selector(values))        // return a function that waits for the selector
    }
    return value => {                                           // there are still values to be curried
        return TupleCtor (n - 1) ([...values, value])           // return the ctor for the remaining args
    }
};

const ChoiceCtor = position => n => choices => {
    if (n === 0 ) {                                                  // we have curried all ctor args, now
        return Object.seal(choices[position] (choices[0]) )          // we call the chosen function with the ctor argument
    }
    return choice => {                                                // there are still choices to be curried
        return ChoiceCtor (position) (n - 1) ([...choices, choice])   // return the ctor for the remaining args
    }
};

// church encoding of the lambda calculus in JavaScript

// function id(x) { return x; }, \x.x
const id = x => x;

// function application, beta reduction
// const beta = f => id(f);
// const beta = f => f;
// beta.toString = () => "beta";
const beta = f => x => f(x);

// M, const, first, id2, true
const konst = x => y => x;

const flip = f => x => y => f(y)(x);

// const flip = f => g => x => f(x)(g);  // f(x)(g(x)) // konst(g)(x) -> g
// const flip = f => g      => s(f)(konst(g));         // C = \fg.S(f)(Kg)
// const flip = f => g => x => s(f)(konst(g))(x);      // def of S
// const flip = f => g => x => f(x)(konst(g)(x));
// const flip = f => g => x => f(x)(g); // qed.

// Kite
// kite = x => y => y;
// kite = x => y => konst(id)(x)(y);
// const kite = konst(id);
// const kite = x => y => flip(konst)(x)(y);
const kite = flip(konst);

// -----

// Bluebird, composition
const cmp = f => g => x => f(g(x));
// const cmp = f => g      => S(konst(f))(g);
// const cmp = f => g => x => S(konst(f))(g)(x);
// const cmp = f => g => x => (konst(f)(x))(g(x));
// const cmp = f => g => x => (f)(g(x));
// const cmp = f => g => x => f(g(x)); // qed.

//const cmp2 = f => g => x => y => f(g(x)(y));
const cmp2 = cmp (cmp)(cmp);

// ---- boolean logic

const T   = konst;
const not = flip;
const F   = not(T);             //const F = kite;

const and = x => y => x(y)(x);
// const and = f => g => f(g)(f);
// const and = f => g => S(f)(konst(f))(g)  // \fg.Sf(Kf)g

// const or  = x => y => x(x)(y);
const or  = x =>  x(x);
// const or  = M;

const beq = x => y => x(y)(not(y));
//const beq = x => y => S(x)(not)(y);
//const beq = x => S(x)(not);   // S(x)(K)

//const xor = cmp (cmp(not)) (beq)   ;
const xor =  cmp2 (not) (beq)   ;

//const imp = x => y => x (y) (T);
//const imp = x => y => x (y) ( not(x));
// const imp = x => y => flip(x) (not(x)) (y) ;
const imp = x => flip(x) (not(x)) ;
// const imp = S(not)(not) ;
//const imp = S(C)(C) ;


// ----

// loop = loop
// loop = (\x. x x) (\x. x x)
// loop = ( x => x(x) ) ( x => x(x) )
// this is self-application applied to self-application, i.e. M(M)
// which we already checked to be endlessly recursive

// rec = f => f (rec (f)) // cannot work, since rec(f) appears in argument position

// define loop in terms of rec:
// const rec = f => f (rec (f));  // y
// const rec = f => M ( x => f(M(x)) )     // s/o

// this works:
// rec :: (a -> a) -> a
const rec  = f => f ( n => rec(f)(n)  ) ;

// ---------- Numbers

const n0 = f => x => x;         // same as konst, F
const n1 = f => x => f(x);      // same as beta, once, lazy
const n2 = f => x => f(f(x));           // twice
const n3 = f => x => f(f(f(x)));        // thrice

//const succ = cn => ( f => x => f( cn(f)(x) ) );
//const succ = cn => ( f => x => f( (cn(f)) (x) ) );
//const succ = cn => ( f => x => cmp(f) (cn(f)) (x)  );
const succ = cn => ( f => cmp(f) (cn(f)) );
//const succ = cn => ( f => S(cmp)(cn)(f) );
//const succ = cn => S(B)(cn);

const n4 = succ(n3);
const n5 = succ(n4);

// addition + n is the nth successor

//const plus = cn1 => cn2 => f => x =>  cn2(succ)(cn1)(f)(x)  ; // eta
const plus = cn1 => cn2 =>  cn2(succ)(cn1)  ;

// multiplication is repeated plus
// const mult = cn1 => cn2 => cn2 (plus(cn1)) (n0) ;
// rolled out example 2 * 3
// const mult = cn1 => cn2 => f => x =>  f f f   f f f   x
// const mult = cn1 => cn2 => f => x =>  cn1 (cn2 (f))  (x); // eta
// const mult = cn1 => cn2 => f =>  cn1 (cn2 (f));  // introduce composition
// const mult = cn1 => cn2 => cmp(cn1)(cn2); // eta
// const mult = cn1 => cmp(cn1); // eta
const mult = cmp;
//const mult = B;

// power is repeated multiplication
// 2 ^ 3 = (2* (2* (2*(1))) ,
// const pow = cn1 => cn2 => cn2 (mult(cn1)) (n1);
// rolled out = f f ( f f ( f f x ))
// const pow = cn1 => cn2 => f => x => cn2 (cn1)(f)(x); // eta
const pow = cn1 => cn2 => cn2 (cn1) ;
// const pow = cn1 => cn2 => beta (cn2) (cn1) ;
// const pow = cn1 => cn2 => flip (beta) (cn1) (cn2) ;
// const pow = flip (beta) ;
// const pow = not(id);       // x^0 = 1

const isZero = cn =>  cn (konst(F)) (T);

const church = n => n === 0 ? n0 : succ(church(n-1)); // church numeral for n

// ----------- Data structures

// prototypical Product Type: pair
const pair = a => b => f => f(a)(b);

const fst$1 = p => p(T); // pick first  element from pair
const snd$1 = p => p(F); // pick second element from pair

// prototypical Sum Type: either

const Left   = x => f => g => f (x);
const Right  = x => f => g => g (x);
const either = e => f => g => e (f) (g);

// maybe as a sum type

// const Nothing  = ()=> f => g => f ;        // f is used as a value
// const Just     = x => f => g => g (x);
// const maybe    = m => f => g => m (f) (g);

const Nothing  = Left() ;        // f is used as a value
const Just     = Right  ;
// const maybe    = either ;     // convenience: caller does not need to repeat "konst"
const maybe    = m => f => either (m) (konst(f)) ;

//    bindMaybe :: m a -> (a -> m b) -> mb
const bindMaybe = ma => f => maybe (ma) (ma) (f);

// ---- curry

// curry :: ((a,b)->c) -> a -> b -> c
const curry = f => x => y => f(x,y);

// uncurry :: ( a -> b -> c) -> ((a,b) -> c)
const uncurry = f => (x,y) => f(x)(y);

// The test "framework", exports the Suite function plus a total of how many assertions have been tested

let total = 0;

function Assert() {
    const results = []; // [Bool], true if test passed, false otherwise
    return {
        results: results,
        true: (testResult) => {
            if (!testResult) { console.error("test failed"); }
            results.push(testResult);
        },
        is: (actual, expected) => {
            const testResult = actual === expected;
            if (!testResult) {
                console.error("test failure. Got '"+ actual +"', expected '" + expected +"'");
            }
            results.push(testResult);
        }
    }
}

const [Test, name, logic] = Tuple(2); // data type to capture test to-be-run

function test(name, callback) {
    const assert = Assert();
    callback(assert);
    report(name, assert.results);
}

function Suite(suiteName) {
    const tests = []; // [Test]
    const suite = {
        test: (testName, callback) => test(suiteName + "-"+ testName, callback),
        add:  (testName, callback) => tests.push(Test (testName) (callback)),
        run:  () => {
            const suiteAssert = Assert();
            tests.forEach( test => test(logic) (suiteAssert) );
            total += suiteAssert.results.length;
            if (suiteAssert.results.every( id )) { // whole suite was ok, report whole suite
                report("suite " + suiteName, suiteAssert.results);
            } else { // some test in suite failed, rerun tests for better error indication
                tests.forEach( test => suite.test( test(name), test(logic) ) );
            }
        }
    };
    return suite;
}

// test result report
// report :: String, [Bool] -> DOM ()
function report(origin, ok) {
    const extend = 20;
    if ( ok.every( elem => elem) ) {
        write(" "+ padLeft(ok.length, 3) +" tests in " + padRight(origin, extend) + " ok.");
        return;
    }
    let reportLine = "    Failing tests in " + padRight(origin, extend);
    bar(reportLine.length);
    write("|" + reportLine+ "|");
    for (let i = 0; i < ok.length; i++) {
        if( ! ok[i]) {
            write("|    Test #"+ padLeft(i, 3) +" failed                     |");
        }
    }
    bar(reportLine.length);
}

function write(message) {
    const out = document.getElementById('out');
    out.innerText += message + "\n";
}

function bar(extend) {
    write("+" + "-".repeat(extend) + "+");
}

const util = Suite("util-times");

// extending the prototype of many objects
util.add("num", assert => {

    const collect = [];

    (10).times( n => collect.push(n) );

    assert.is(collect.length, 10);
    assert.is(collect[0], 0);
    assert.is(collect[9], 9);

});

util.add("str", assert => {

    const collect = [];

    '10'.times( n => collect.push(n) );

    assert.is(collect.length, 10);
    assert.is(collect[0], 0);
    assert.is(collect[9], 9);

});

util.run();

const util$1 = Suite("util-strings");

// extending the prototype of many objects
util$1.add("padLeft", assert => {

    const collect = [];

    (10).times( n => collect.push(n) );

    assert.is(padLeft("a",2), " a");
    assert.is(padLeft("a",1), "a");
    assert.is(padLeft("a",0), "a");

});

util$1.run();

const Observable = value => {
    const listeners = [];
    return {
        onChange: callback => {
            listeners.push(callback);
            callback(value, value);
        },
        getValue: ()       => value,
        setValue: newValue => {
            if (value === newValue) return;
            const oldValue = value;
            value = newValue;
            listeners.forEach(callback => callback(value, oldValue));
        }
    }
};


const ObservableList = list => {
    const addListeners = [];
    const delListeners = [];
    const removeAt     = array => index => array.splice(index, 1);
    const removeItem   = array => item  => { const i = array.indexOf(item); if (i>=0) removeAt(array)(i); };
    const listRemoveItem     = removeItem(list);
    const delListenersRemove = removeAt(delListeners);
    return {
        onAdd: listener => addListeners.push(listener),
        onDel: listener => delListeners.push(listener),
        add: item => {
            list.push(item);
            addListeners.forEach( listener => listener(item));
            return item;
        },
        del: item => {
            listRemoveItem(item);
            const safeIterate = [...delListeners]; // shallow copy as we might change listeners array while iterating
            safeIterate.forEach( (listener, index) => listener(item, () => delListenersRemove(index) ));
        },
        removeDeleteListener: removeItem(delListeners),
        count:   ()   => list.length,
        countIf: pred => list.reduce( (sum, item) => pred(item) ? sum + 1 : sum, 0)
    }
};

const observable = Suite("observable");

observable.add("value", assert => {

    const obs = Observable("");

//  initial state
    assert.is(obs.getValue(),  "");

//  subscribers get notified
    let found;
    obs.onChange(val => found = val);
    obs.setValue("firstValue");
    assert.is(found,  "firstValue");

//  value is updated
    assert.is(obs.getValue(),  "firstValue");

//  it still works when the receiver symbols changes
    const newRef = obs;
    newRef.setValue("secondValue");
    // listener updates correctly
    assert.is(found,  "secondValue");

//  Attributes are isolated, no "new" needed
    const secondAttribute = Observable("");

//  initial state
    assert.is(secondAttribute.getValue(),  "");

//  subscribers get notified
    let secondFound;
    secondAttribute.onChange(val => secondFound = val);
    secondAttribute.setValue("thirdValue");
    assert.is(found,  "secondValue");
    assert.is(secondFound,  "thirdValue");

//  value is updated
    assert.is(secondAttribute.getValue(),  "thirdValue");

});

observable.add("list", assert => {
    const raw  = [];
    const list = ObservableList( raw ); // decorator pattern

    assert.is(list.count(), 0);
    let addCount = 0;
    let delCount = 0;
    list.onAdd( item => addCount += item);
    list.add(1);
    assert.is(addCount, 1);
    assert.is(list.count(), 1);
    assert.is(raw.length, 1);

    list.onDel( item => delCount += item);
    list.del(1);
    assert.is(delCount, 1);
    assert.is(list.count(), 0);
    assert.is(raw.length, 0);

});

observable.run();

// the SKI combinators for the church encoding

// self-application, Mockingbird, \x.x x
const M = f => beta(f)(f);  // f(f)

// identity is SKK, S(konst)(konst)
// S(K)(K)(x) = konst(x)( konst(x) )
// S(K)(K)(x) =      (x)
// S(K)(K)(x) =    id(x)
// S(K)(K)    =    id          // qed


// ---- boolean logic

// const imp = S(C)(C) ;

// ----
// Graham Hutton: https://www.youtube.com/watch?v=9T8A89jgeTI

// Y combinator: \f. (\x.f(x x)) (\x.f(x x))
// Y = f => ( x => f(x(x)) )  ( x => f(x(x)) )
// Y is a fixed point for every f: Y(f) == Y(Y(f))
// \f. M(\x. f(Mx))
// f => M(x => f(M(x)))

// in a non-lazy language, we need the Z fixed-point combinator
// \f. (\x. f(\v.xxv)) (\x. f(\v.xxv))
// \f. M(\x. f(\v. Mxv))
const Z = f => M(x => f(v => M(x)(v) ));

// const mult = B;

const Th = f => g => g(f);  // Thrush combinator  Th \af.fa ; CI
  // Vireo  V \abf.fab

const churchSuite = Suite("church");


churchSuite.add("identity", assert => {

        // identity
        assert.is( id(0) , 0);
        assert.is( id(1) , 1);
        assert.is( id , id);    // JS has function identity
        assert.true( id == id);     // JS has function equality by string representation
        assert.true( "x => x" == id);

        // function equivalence
        const other = x => x;
        assert.true( "x => x" == other);

        const alpha = y => y;
        assert.true( alpha != id );  // JS has no alpha equivalence

        // in JS, a == b && a == c  does not imply b == c
        assert.true( id != other);
        assert.true( id.toString() == other.toString());

        assert.is( id(id) , id);

    }
);

churchSuite.add("mockingbird", assert => {

        assert.is( M(id) , id ); // id of id is id

        assert.is("x => f(x)" , M(beta).toString()); // ???
        // M(beta) == beta => beta(beta)(beta)
        // M(beta) == beta(beta)(beta)
        // M(beta) == f => x => f(x)
        // M(beta) == beta => beta => beta(beta)
        // M(beta) == beta(beta)
        // M(beta) == f => x => f(x)
        // M(beta) == beta => x => beta(x)
        // M(beta) == x => beta(x)           // eta reduction
        // M(beta) == beta                   // qed.
        const inc = x => x + 1;
        assert.is( M(beta)(inc)(0) , beta(inc)(0)); //extensional equality


        // when loaded as an async module, this code crashes Safari and does not produce a proper s/o error
        // You can uncomment to test with a synchronous bundle.
        // try {
        //     assert.is( M(M) , M );  // recursion until s/o
        //     assert.true( false );   // must not reach here
        // } catch (e) {
        //     assert.true(true) // maximum call size error expected
        // }
    }
);


churchSuite.add("kestrel", assert => {

        assert.is(konst(5)(1) , 5);
        assert.is(konst(5)(2) , 5);

        assert.is(konst(id)(0) , id);
        assert.is(konst(id)(0)(1) , 1); // id(1)

    }
);


churchSuite.add("kite", assert => {

        assert.is(kite(1)(5) , 5);
        assert.is(kite(2)(5) , 5);

    }
);

churchSuite.add("flip", assert => {

        const append = x => y => x + y;
        assert.is( append("x")("y") , "xy");
        assert.is( flip(append)("x")("y") , "yx");

        const backwards = flip(append);
        assert.is( backwards("x")("y") , "yx");

    }
);


churchSuite.add("boolean", assert => {
        let bool = x => x(true)(false); // only for easier testing
        let veq = x => y => bool(beq(x)(y)); // value equality

        assert.true(   bool(T) );   // sanity checks
        assert.true( ! bool(F) );
        assert.true(   veq(T)(T) );
        assert.true( ! veq(T)(F) );
        assert.true( ! veq(F)(T) );
        assert.true(   veq(F)(F) );

        assert.true( veq (not(T)) (F) );
        assert.true( veq (not(F)) (T) );

        assert.true( veq (T) (and(T)(T)) );
        assert.true( veq (F) (and(T)(F)) );
        assert.true( veq (F) (and(F)(T)) );
        assert.true( veq (F) (and(F)(F)) );

        assert.true( veq (T) (or(T)(T)) );
        assert.true( veq (T) (or(T)(F)) );
        assert.true( veq (T) (or(F)(T)) );
        assert.true( veq (F) (or(F)(F)) );

        assert.true( veq (F) (xor(T)(T)) );
        assert.true( veq (T) (xor(T)(F)) );
        assert.true( veq (T) (xor(F)(T)) );
        assert.true( veq (F) (xor(F)(F)) );

        assert.true( veq (T) (imp(T)(T)) );
        assert.true( veq (F) (imp(T)(F)) );
        assert.true( veq (T) (imp(F)(T)) );
        assert.true( veq (T) (imp(F)(F)) );

        // addition from numerals
        assert.true( veq (T) (isZero(n0)) );
        assert.true( veq (F) (isZero(n1)) );
        assert.true( veq (F) (isZero(n2)) );

    }
);


churchSuite.add("composition", assert => {

        const inc = x => x + 1;
        assert.is( cmp(inc)(inc)(0) , 2);

        const append = x => y => x + y;          // have an impl.
        const f2 = x => y => append(x)(y); // curried form for experiment
        const f1 = x =>      f2(x);
        const f0 =           f1;

        assert.is( f2("x")("y") , "xy");
        assert.is( f1("x")("y") , "xy");
        assert.is( f0("x")("y") , "xy");

        // explain currying sequence with paren nesting
        // const myappend = (x => (y => (append(x)) (y) ));

    }
);


churchSuite.add("recursion", assert => {

        assert.is( rec(konst(1))  , 1);
        assert.is( Z(konst(1))    , 1); // the same in terms of the Z combinator

        // hand-made recursion
        const triangle = n => n < 1 ? 0 : triangle(n-1) + n;
        assert.is( triangle(10) , 55);

        // tail recursion
        const triTail = acc => n => n < 1 ? acc : triTail(acc + n)(n-1);
        assert.is( triTail(0)(10) , 55);

        // triFun does not longer appear on the right-hand side of the recursion!
        const triFun = f => acc => n => n < 1 ? acc : f(acc + n)(n-1) ;
        assert.is( rec (triFun)(0)(10) , 55);
        assert.is( Z   (triFun)(0)(10) , 55); // the same in terms of the Z combinator
        assert.is( rec (f => acc => n => n < 1 ? acc : f(acc + n)(n-1)) (0)(10) , 55);

        // if even works with non-tail recursion
        assert.is( rec (f => n => n < 1 ? 0 : f(n-1) + n) (10) , 55);

        // ideas for more exercises:
        // count, sum, product, (evtl later on array: none, any, every)

    }
);


churchSuite.add("numbers", assert => {

        const inc = x => x + 1;
        const nval = cn => cn(inc)(0);

        assert.is( nval(n0) , 0 );
        assert.is( nval(n1) , 1 );
        assert.is( nval(n2) , 2 );
        assert.is( nval(n3) , 3 );

        assert.is( nval( succ(n3) ) , 4 );

        assert.is( nval(n4) , 4 );
        assert.is( nval(n5) , 5 );

        assert.is( nval( succ(succ(n3))) , 3 + 1 + 1 );
        assert.is( nval( plus(n3)(n2))   , 3 + 2 );

        assert.is( nval( plus(n2)(plus(n2)(n2)) )   , 2 + 2 + 2 );
        assert.is( nval( mult(n2)(n3) )             , 2 * 3 );
        assert.is( nval( mult(n2)(n3) )             , 2 * 3 );

        assert.is( nval( pow(n2)(n3) )              , 2 * 2 * 2); // 2^3
        assert.is( nval( pow(n2)(n0) )              , 1); // x^0
        assert.is( nval( pow(n2)(n1) )              , 2); // x^1
        assert.is( nval( pow(n0)(n2) )              , 0); // 0^x
        assert.is( nval( pow(n1)(n2) )              , 1); // 1^x

        assert.is( nval( pow(n0)(n0) )              , 1); // 0^0  // Ha !!!

        assert.true ( nval( church(42) ) === 42 );

        const sval = cn => cn(s => 'I' + s)('');
        assert.is( sval(church(10)) , 'IIIIIIIIII');

        const qval = cn => cn(n => cn(inc)(n))(0); // square by cont adding
        assert.is( qval(church(9)) , 81 );

        const aval = cn => cn(a => a.concat(a[a.length-1]+a[a.length-2]) ) ( [0,1] );
        assert.is( aval(church(10-2)).toString() , '0,1,1,2,3,5,8,13,21,34');  // fibonacci numbers

        const oval = cn => cn(o => ({acc:o.acc+o.i+1, i:o.i+1})  ) ( {acc:0, i:0} );
        assert.is( oval(church(10)).acc , 55);  // triangle numbers

        // Thrush can be used as a one-element closure
        const closure = Th(1);  // closure is now "storing" the value until a function uses it
        assert.is( closure(id)  , 1 );
        assert.is( closure(inc) , 2 );

    }
);

churchSuite.add("pair", assert => {

        const p = pair(0)(1);      // constituent of a product type
        assert.is( fst$1(p)   , 0);  // p(konst) (pick first element of pair)
        assert.is( snd$1(p)   , 1);  // p(kite)  (pick second element of pair)

        const pval = cn => cn(p => pair(fst$1(p) + snd$1(p) + 1)(snd$1(p) + 1) ) ( pair(0)(0) );
        assert.is( fst$1(pval(church(10))) , 55);  // triangle numbers

    }
);

churchSuite.add("lazy", assert => {

        // when using church-boolean, either or maybe as control structures,
        // the branches must be lazy, or otherwise eager evaluation will call
        // both branches.

        let x = false;
        let y = false;
        T (x=true) (y=true);
        assert.true(x === true && y === true); // wrong: y should be false!

        // it does *not* help to defer execution via abstraction!
        x = false;
        y = false;
        T (konst(x=true)) (konst(y=true)) ();
        assert.true(x === true && y === true);// wrong: y should be false!

        // this doesn't work either
        x = false;
        y = false;
        const good = konst(x=true);
        const bad  = konst(y=true);
        T (good) (bad) ();
        assert.true(x === true && y === true);// wrong: y should be false!

        // literal definition of laziness works
        x = false;
        y = false;
        T (() => (x=true)) (() => (y=true)) ();
        assert.true(x === true && y === false);

        // this works
        x = false;
        y = false;
        function good2() {x=true;}
        function bad2()  {y=true;}
        T (good2) (bad2) ();
        assert.true(x === true && y === false);

        // and this works
        x = false;
        y = false;
        const good3 = () => x=true;
        const bad3  = () => y=true;
        T (good3) (bad3) ();
        assert.true(x === true && y === false);

    }
);

churchSuite.add("either", assert => {

        const left = Left(true);   // constituent of a sum type
        assert.true( either (left) (id) (konst(false)) );  // left is true, right is false

        const right = Right(true);   // constituent of a sum type
        assert.true( either (right) (konst(false)) (id) );  // left is false, right is true

    }
);

churchSuite.add("maybe", assert => {

        const no = Nothing;
        assert.true( maybe (no) ( true ) (konst(false)) );  // test the nothing case

        const good = Just(true);
        assert.true( maybe (good) ( false ) (id) );  // test the just value

        const bound = bindMaybe(Just(false))( b => Right(not(b))); // bind with not
        assert.true( maybe (bound) ( false ) (id) );  // test the just value

    }
);

churchSuite.add("curry", assert => {

        function add2(x,y) { return x + y }
        const inc = curry(add2);
        assert.is( inc(1)(1) ,  2);
        assert.is( inc(5)(7) , 12);

        const add3 = uncurry(curry(add2));
        assert.is( add3(1,1) , 2 );

    }
);


churchSuite.run(); // go for the lazy eval as this will improve reporting later

const rock = Suite("rock");

rock.add("border", assert => {

     try {
         Tuple(-1);
         assert.true(false); // must not reach here
     } catch (expected) {
         assert.true(true);
     }

     try {
         Tuple(0);
         assert.true(false); // must not reach here
     } catch (expected) {
         assert.true(true);
     }
});

rock.add("pair", assert => {

     const dierk = Pair("Dierk")("König");
     const firstname = fst;
     const lastname  = snd;

     assert.is(dierk(firstname), "Dierk");
     assert.is(dierk(lastname),  "König");

});

rock.add("tuple3", assert => {

     const [Person, firstname, lastname, age] = Tuple(3);

     const dierk = Person("Dierk")("König")(50);

     assert.is(dierk(firstname), "Dierk");
     assert.is(dierk(lastname),  "König");
     assert.is(dierk(age),       50);

});

rock.add("choice", assert => {

    const [Cash, CreditCard, Transfer, match] = Choice(3); // generalized sum type

    const pay = payment => match(payment)                  // "pattern" match
        (() =>
             amount => 'pay ' + amount + ' cash')
        (({number, sec}) =>
             amount => 'pay ' + amount + ' with credit card ' + number + ' / ' + sec)
        (([from, to]) =>
             amount => 'pay ' + amount + ' by wire from ' + from + ' to ' + to);

    let payment = Cash();
    assert.is(pay(payment)(50), 'pay 50 cash');

    payment = CreditCard({number: '0000 1111 2222 3333', sec: '123'});
    assert.is(pay(payment)(50), 'pay 50 with credit card 0000 1111 2222 3333 / 123');

    payment = Transfer(['Account 1', 'Account 2']);
    assert.is(pay(payment)(50), 'pay 50 by wire from Account 1 to Account 2');

});

rock.run();

const DataFlowVariable = howto => {
    let value = undefined;
    return () => {
        if (value !== undefined) { return value }
        value = howto();
        return value;
    }
};

// execute asynchronous tasks in strict sequence
const Scheduler = () => {
    let inProcess = false;
    const tasks = [];
    function process() {
        if (inProcess) return;
        if (tasks.length === 0) return;
        inProcess = true;
        const task = tasks.pop();
        const prom = new Promise( (ok, reject) => task(ok) );
        prom.then( _ => {
            inProcess = false;
            process();
        });
    }
    function add(task) {
        tasks.unshift(task);
        process();
    }
    return {
        add: add,
        addOk: task => add( ok => { task(); ok(); }) // convenience
    }
};

const dataflow = Suite("dataflow");

dataflow.add("value", assert => {

    const z = DataFlowVariable(() => x() + y());    // z depends on x and y, which are set later...
    const x = DataFlowVariable(() => y());          // x depends on y, which is set later...
    const y = DataFlowVariable(() => 1);

    assert.is(z(), 2);
    assert.is(x(), 1);
    assert.is(y(), 1);

});

dataflow.add("cache", assert => { // value must be set at most once

    let counter = 0;
    const x = DataFlowVariable(() => {
        counter++;
        return 1;
    });

    assert.is(counter, 0);
    assert.is(x(), 1);
    assert.is(counter, 1);
    assert.is(x(), 1);
    assert.is(counter, 1);

});


dataflow.add("async", assert => { // promise must be set at most once

    let counter = 0;

    const x = DataFlowVariable( async () => await y() * 3);
    const y = DataFlowVariable(() => {
        counter++;
        return new Promise( ok => setTimeout(ok(3), 10))
    });

    x().then( val => assert.is(counter,1));
    x().then( val => assert.is(val,9));
    x().then( val => assert.is(counter,1)); // yes, again!
    assert.true(true); // check console

});



dataflow.add("scheduler", assert => {

    const result = [];

    const scheduler = Scheduler();
    scheduler.add(ok => {
        setTimeout(_ => {   // we wait before pushing
            result.push(1);
            ok();
        }, 100);
    });
    scheduler.add(ok => {   // we push "immediately"
        result.push(2);
        ok();
    });
    scheduler.addOk ( () => result.push(3)); // convenience

    scheduler.add(ok => {
        assert.is(result[0], 1); // sequence is still ensured
        assert.is(result[1], 2);
        assert.is(result[2], 3);
    });

    assert.true(true); // any assertion error will appear in the console, not in the report

});

dataflow.run();

const VALUE    = "value";
const VALID    = "valid";
const EDITABLE = "editable";
const LABEL    = "label";

const Attribute = value => {

    const observables = {};

    const hasObs = name => observables.hasOwnProperty(name);

    const getObs = (name, initValue = null) =>
        hasObs(name)
            ? observables[name]
            : observables[name] = Observable(initValue);

    getObs(VALUE, value); // initialize the value at least

    let   convert           = id ;
    const setConverter      = converter => {
        convert = converter;
        setConvertedValue(value);
    };
    const setConvertedValue = val => getObs(VALUE).setValue(convert(val));

    // todo: this might set many validators without discharging old ones
    const setValidator = validate => getObs(VALUE).onChange( val => getObs(VALID).setValue(validate(val)));

    return { getObs, hasObs, setValidator, setConverter, setConvertedValue }
};

const todoTextProjector = todo => {

    const inputElement = document.createElement("INPUT");
    inputElement.type = "text";
    inputElement.size = 42;

    inputElement.oninput = _ => todo.setText(inputElement.value);

    todo.onTextChanged(_ => inputElement.value = todo.getText());

    todo.onTextValidChanged(
        valid => valid
          ? inputElement.classList.remove("invalid")
          : inputElement.classList.add("invalid")
    );

    todo.onTextEditableChanged(
        isEditable => isEditable
        ? inputElement.removeAttribute("readonly")
        : inputElement.setAttribute("readonly", true));

    return inputElement;
};

const todoDoneProjector = todo => {

    const checkboxElement = document.createElement("INPUT");
    checkboxElement.type = "checkbox";

    checkboxElement.onclick = _ => todo.setDone(checkboxElement.checked);

    todo.onDoneChanged(
        done => done
        ? checkboxElement.setAttribute("checked", true)
        : checkboxElement.removeAttribute("checked")
    );

    return checkboxElement;
};

const todoItemProjector = (todoController, rootElement, todo) => {

    const deleteButton      = document.createElement("Button");
    deleteButton.setAttribute("class","delete");
    deleteButton.innerHTML  = "&times;";
    deleteButton.onclick    = _ => todoController.removeTodo(todo);

    const inputElement      = todoTextProjector(todo);
    const checkboxElement   = todoDoneProjector(todo);

    todoController.onTodoRemove( (removedTodo, removeMe) => {
        if (removedTodo !== todo) return;
        rootElement.removeChild(deleteButton);
        rootElement.removeChild(inputElement);
        rootElement.removeChild(checkboxElement);
        removeMe();
    } );

    rootElement.appendChild(deleteButton);
    rootElement.appendChild(inputElement);
    rootElement.appendChild(checkboxElement);
};

// stand-in for an asynchronous service

const fortunes = [
    "Do the WebPr Homework",
    "Care for the JavaScript Toolbox",
    "Watch the recommended videos",
    "Read the recommended chapters in You-dont-know-JS",
    "Do the dataflow excel challenge!"
];

function fortuneService(whenDone) {
    setTimeout(
        () => whenDone(fortunes[Math.floor((Math.random() * fortunes.length))]),
        Math.floor((Math.random() * 3000))
    );
}

const TodoController = () => {

    const Todo = () => {                               // facade
        const textAttr = Attribute("text");
        const doneAttr = Attribute(false);

        textAttr.setConverter( input => input.toUpperCase() );
        textAttr.setValidator( input => input.length >= 3   );

        // business rules / constraints (the text is only editable if not done)
        doneAttr.getObs(VALUE).onChange( isDone => textAttr.getObs("EDITABLE",!isDone).setValue(!isDone));

        return {
            getDone:            doneAttr.getObs(VALUE).getValue,
            setDone:            doneAttr.getObs(VALUE).setValue,
            onDoneChanged:      doneAttr.getObs(VALUE).onChange,
            getText:            textAttr.getObs(VALUE).getValue,
            setText:            textAttr.setConvertedValue,
            onTextChanged:      textAttr.getObs(VALUE).onChange,
            onTextValidChanged: textAttr.getObs(VALID).onChange,
            onTextEditableChanged: textAttr.getObs("EDITABLE").onChange,
        }
    };

    const todoModel = ObservableList([]); // observable array of Todos, this state is private
    const scheduler = Scheduler();

    const addTodo = () => {
        const newTodo = Todo();
        todoModel.add(newTodo);
        return newTodo;
    };

    const addFortuneTodo = () => {
        const newTodo = Todo();
        todoModel.add(newTodo);
        newTodo.setText('...');
        scheduler.add( ok =>
           fortuneService( text => {
                   newTodo.setText(text);
                   ok();
               }
           )
        );
    };

    return {
        numberOfTodos:      todoModel.count,
        numberOfopenTasks:  () => todoModel.countIf( todo => ! todo.getDone() ),
        addTodo:            addTodo,
        addFortuneTodo:     addFortuneTodo,
        removeTodo:         todoModel.del,
        onTodoAdd:          todoModel.onAdd,
        onTodoRemove:       todoModel.onDel,
        removeTodoRemoveListener: todoModel.removeDeleteListener, // only for the test case, not used below
    }
};


// View-specific parts

const TodoItemsView = (todoController, rootElement) => {

    const render = todo =>
        todoItemProjector(todoController, rootElement, todo);

    // binding

    todoController.onTodoAdd(render);

    // we do not expose anything as the view is totally passive.
};

const TodoTotalView = (todoController, numberOfTasksElement) => {

    const render = () =>
        numberOfTasksElement.innerText = "" + todoController.numberOfTodos();

    // binding

    todoController.onTodoAdd(render);
    todoController.onTodoRemove(render);
};

const TodoOpenView = (todoController, numberOfOpenTasksElement) => {

    const render = () =>
        numberOfOpenTasksElement.innerText = "" + todoController.numberOfopenTasks();

    // binding

    todoController.onTodoAdd(todo => {
        render();
        todo.onDoneChanged(render);
    });
    todoController.onTodoRemove(render);
};

const todoSuite = Suite("todo");

todoSuite.add("todo-crud", assert => {

    // setup
    const todoContainer = document.createElement("div");
    const numberOfTasks = document.createElement("span");
    numberOfTasks.innerText = '0';
    const openTasks = document.createElement("span");
    openTasks.innerText = '0';

    const todoController = TodoController();

    TodoItemsView(todoController, todoContainer);  // three views that share the same controller and thus model
    TodoTotalView(todoController, numberOfTasks);
    TodoOpenView (todoController, openTasks);

    const elementsPerRow = 3;

    assert.is(todoContainer.children.length, 0*elementsPerRow);
    assert.is(numberOfTasks.innerText, '0');
    assert.is(openTasks.innerText, '0');

    todoController.addTodo();

    assert.is(todoContainer.children.length, 1*elementsPerRow);
    assert.is(numberOfTasks.innerText, '1');
    assert.is(openTasks.innerText, '1');

    todoController.addTodo();

    assert.is(todoContainer.children.length, 2*elementsPerRow);
    assert.is(numberOfTasks.innerText, '2');
    assert.is(openTasks.innerText, '2');

    const firstInput = todoContainer.querySelectorAll("input[type=text]")[0];
    const firstCheckbox = todoContainer.querySelectorAll("input[type=checkbox]")[0];
    assert.is(firstCheckbox.checked, false);
    assert.is(firstInput.hasAttribute("readonly"), false);

    firstCheckbox.click();

    assert.is(firstCheckbox.checked, true);
    // check business rule that done items are read-only
    assert.is(firstInput.hasAttribute("readonly"), true);

    assert.is(todoContainer.children.length, 2*elementsPerRow); // did not change
    assert.is(numberOfTasks.innerText, '2');                    // did not change
    assert.is(openTasks.innerText, '1');                        // changed

    // add a test for the deletion of a todo-item

    // delete a checked item

    const firstDeleteBtn = todoContainer.querySelectorAll("button.delete")[0];
    firstDeleteBtn.click();

    assert.is(todoContainer.children.length, 1*elementsPerRow);
    assert.is(numberOfTasks.innerText, '1');
    assert.is(openTasks.innerText, '1');      // remains!

    // delete an unchecked item

    const secondDeleteBtn = todoContainer.querySelectorAll("button.delete")[0];
    secondDeleteBtn.click();

    assert.is(todoContainer.children.length, 0*elementsPerRow);
    assert.is(numberOfTasks.innerText, '0');
    assert.is(openTasks.innerText, '0');      // changes

});

todoSuite.add("todo-memory-leak", assert => {  // variant with remove-me callback
    const todoController = TodoController();

    todoController.onTodoAdd(todo => {
       todoController.onTodoRemove( (todo, removeMe) => {
           removeMe(); // un- / comment to see the difference
       });
    });

    for (let i=0; i<10000; i++){   // without removeMe:  10000 : 2s, 20000: 8s, 100000: ???s
        const todo = todoController.addTodo();
        todoController.removeTodo(todo);
    }
});

todoSuite.add("todo-memory-leak-2", assert => {  // variant with listener identity
    const todoController = TodoController();

    todoController.onTodoAdd(todo => {

       const removeListener = todo => {
           // do the normal stuff, e.g. remove view elements
           // then remove yourself
           todoController.removeTodoRemoveListener(removeListener);
       };
       todoController.onTodoRemove( removeListener );
    });

    for (let i=0; i<10000; i++){
        const todo = todoController.addTodo();
        todoController.removeTodo(todo);
    }
});

todoSuite.add("business-rule", assert => {  // done implies not editable
    const todoController = TodoController();
    todoController.onTodoAdd(todo => {
        let editable = false;
        todo.setDone(false);
        todo.onTextEditableChanged(val => editable = val);
        assert.is(editable, true);
        todo.setDone(true);
        assert.is(editable, false);
    });
    todoController.addTodo();
});

todoSuite.run();

const pmSuite = Suite("presModel");

pmSuite.add("attr-value", assert => {
    const attr = Attribute("init");
    assert.true(attr.hasObs(VALUE));
    assert.is(attr.hasObs(VALID), false);
    assert.is(attr.getObs(VALUE).getValue(), "init");
    assert.is(attr.getObs(VALID, true).getValue(), true);  // default
    assert.is(attr.hasObs(VALID), true);
});

pmSuite.add("attr-convert", assert => {
    const attr = Attribute("init");
    attr.setConverter(str => str.toUpperCase());
    assert.is(attr.getObs(VALUE).getValue(), "INIT"); // existing value is converted
    attr.setConvertedValue("xxx");               // specialized function: ...
    assert.is(attr.getObs(VALUE).getValue(), "XXX");  // ... converted
    attr.getObs(VALUE).setValue("xxx");               // direct access to observable function: ...
    assert.is(attr.getObs(VALUE).getValue(), "xxx");  // ... does _not_ convert
});

pmSuite.add("attr-valid", assert => {
    const attr = Attribute("init");
    let   valid = undefined;
    attr.getObs(VALID, true).onChange(x => valid = x);
    assert.is(valid, true);
    attr.setValidator( val => val.length > 4);
    assert.is(valid, false);
    attr.setConvertedValue("12345");
    assert.is(valid, true);
});


pmSuite.run();

/**
 * @module Controllers as shallow wrappers around observables
 */

const ListController = modelConstructor => {

    const listModel = ObservableList([]); // observable array of models, this state is private

    return {
        addModel:            () => listModel.add(modelConstructor()),
        removeModel:         listModel.del,
        onModelAdd:          listModel.onAdd,
        onModelRemove:       listModel.onDel,
    }
};

const SelectionController = noSelection => {

    const selectedModelObs = Observable(noSelection);

    return {
        setSelectedModel : selectedModelObs.setValue,
        getSelectedModel : selectedModelObs.getValue,
        onModelSelected:   selectedModelObs.onChange,
        clearSelection:     () => selectedModelObs.setValue(noSelection),
    }
};

const masterClassName = 'instant-update-master'; // should be unique for this projector
const detailClassName = 'instant-update-detail';

const bindTextInput = (textAttr, inputElement) => {
    inputElement.oninput = _ => textAttr.setConvertedValue(inputElement.value);

    textAttr.getObs(VALUE).onChange(text => inputElement.value = text);

    textAttr.getObs(VALID, true).onChange(
        valid => valid
          ? inputElement.classList.remove("invalid")
          : inputElement.classList.add("invalid")
    );

    textAttr.getObs(EDITABLE, true).onChange(
        isEditable => isEditable
        ? inputElement.removeAttribute("readonly")
        : inputElement.setAttribute("readonly", true));

    textAttr.getObs(LABEL, '').onChange(label => inputElement.setAttribute("title", label));
};

const textInputProjector = textAttr => {

    const inputElement = document.createElement("INPUT");
    inputElement.type = "text";
    inputElement.size = 20;

    bindTextInput(textAttr, inputElement);

    return inputElement;
};

const listItemProjector = (masterController, selectionController, rootElement, model, attributeNames) => {

    if(rootElement.style['grid-template-columns'] === '') {
        rootElement.classList.add(masterClassName);
        const columStyle = '1.7em '+ attributeNames.map(x=>'auto').join(' ');
        rootElement.style['grid-template-columns'] = columStyle;
    }
    const deleteButton      = document.createElement("Button");
    deleteButton.setAttribute("class","delete");
    deleteButton.innerHTML  = "&times;";
    deleteButton.onclick    = _ => masterController.removeModel(model);

    const inputElements = [];

    attributeNames.forEach( attributeName => {
        const inputElement = textInputProjector(model[attributeName]);
        inputElement.onfocus = _ => selectionController.setSelectedModel(model);
        inputElements.push(inputElement);
    });

    selectionController.onModelSelected(
        selected => selected === model
          ? deleteButton.classList.add("selected")
          : deleteButton.classList.remove("selected")
    );

    masterController.onModelRemove( (removedModel, removeMe) => {
        if (removedModel !== model) return;
        rootElement.removeChild(deleteButton);
        inputElements.forEach( inputElement => rootElement.removeChild(inputElement));
        selectionController.clearSelection();
        removeMe();
    } );

    rootElement.appendChild(deleteButton);
    inputElements.forEach( inputElement => rootElement.appendChild(inputElement));
    selectionController.setSelectedModel(model);
};

const formProjector = (detailController, rootElement, model, attributeNames) => {

    const divElement = document.createElement("DIV");
    divElement.innerHTML = `
    <FORM>
        <DIV class="${detailClassName}">
        </DIV>
    </FORM>`;
    const detailFormElement = divElement.querySelector("." + detailClassName);

    attributeNames.forEach(attributeName => {
        const labelElement = document.createElement("LABEL"); // add view for attribute of this name
        labelElement.setAttribute("for", attributeName);
        const inputElement = document.createElement("INPUT");
        inputElement.setAttribute("TYPE", "text");
        inputElement.setAttribute("SIZE", "20");
        inputElement.setAttribute("ID", attributeName);
        detailFormElement.appendChild(labelElement);
        detailFormElement.appendChild(inputElement);

        bindTextInput(model[attributeName], inputElement);
        model[attributeName].getObs(LABEL, '').onChange(label => labelElement.textContent = label);
    });

    if (rootElement.firstChild) {
        rootElement.firstChild.replaceWith(divElement);
    } else {
        rootElement.appendChild(divElement);
    }
};


const pageCss = `
    .${masterClassName} {
        display:        grid;
        grid-column-gap: 0.5em;
        grid-template-columns: 1.7em auto auto; /* default: to be overridden dynamically */
        margin-bottom:  0.5em ;
    }
    .${detailClassName} {
        display:        grid;
        grid-column-gap: 0.5em;
        grid-template-columns: 1fr 3fr;
        margin-bottom:  0.5em ;
    }
`;

// page-style change, only executed once
const style = document.createElement("STYLE");
style.innerHTML = pageCss;
document.head.appendChild(style);

const ALL_ATTRIBUTE_NAMES = ['firstname', 'lastname'];

const Person = () => {                               // facade
    const firstnameAttr = Attribute("Monika");
    firstnameAttr.getObs(LABEL).setValue("First Name");

    const lastnameAttr  = Attribute("Mustermann");
    lastnameAttr.getObs(LABEL).setValue("Last Name");

    // lastnameAttr.setConverter( input => input.toUpperCase() );
    // lastnameAttr.setValidator( input => input.length >= 3   );

    return {
        firstname:          firstnameAttr,
        lastname:           lastnameAttr,
    }
};

// View-specific parts

const MasterView = (listController, selectionController, rootElement) => {

    const render = person =>
        listItemProjector(listController, selectionController, rootElement, person, ALL_ATTRIBUTE_NAMES);

    // binding
    listController.onModelAdd(render);
};

const NoPerson = (() => { // one time creation, singleton
    const johnDoe = Person();
    johnDoe.firstname.setConvertedValue("");
    johnDoe.lastname.setConvertedValue("");
    return johnDoe;
})();

const DetailView = (selectionController, rootElement) => {

    const render = person =>
        formProjector(selectionController, rootElement, person, ALL_ATTRIBUTE_NAMES);

    selectionController.onModelSelected(render);
};

const personSuite = Suite("person");

personSuite.add("crud", assert => {

    // setup
    const masterContainer = document.createElement("div");
    const detailContainer = document.createElement("div");
    detailContainer.innerHTML = "<div>to replace</div>";

    const masterController    = ListController(Person);
    const selectionController = SelectionController(NoPerson);

    // create the sub-views, incl. binding

    MasterView(masterController, selectionController, masterContainer);
    DetailView(selectionController, detailContainer);

    const elementsPerRow = 3;

    assert.is(masterContainer.children.length, 0*elementsPerRow);

    masterController.addModel();

    assert.is(masterContainer.children.length, 1*elementsPerRow);

    masterController.addModel();

    assert.is(masterContainer.children.length, 2*elementsPerRow);

    const firstInput = masterContainer.querySelectorAll("input[type=text]")[0];
    const firstDeleteButton = masterContainer.querySelectorAll("button")[0];

    firstDeleteButton.click();

    assert.is(masterContainer.children.length, 1*elementsPerRow);


});

// todo: test for memory leak (difficult)

personSuite.run();

// importing all tests that make up the suite of tests that are build on the ES6 module system
