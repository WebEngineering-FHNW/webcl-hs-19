import { Suite }     from "../test/test.js";
import { Attribute, VALUE, VALID } from "./presentationModel.js";

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
