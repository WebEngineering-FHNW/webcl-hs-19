import "./times.js" // we import no symbols as they are set on the respective prototypes
import { Suite } from "../test/test.js"

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
