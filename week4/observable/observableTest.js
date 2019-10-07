
import {Observable, ObservableList} from "./observable.js"
import { Suite } from "../test/test.js"

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
