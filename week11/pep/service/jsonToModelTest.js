import { Suite }        from "../../test/test.js";
import { toDeveloper }  from "./jsonToModel.js";

const jsonToModelSuite = Suite("jsonToModel");

jsonToModelSuite.add("dev-normal", assert => {
    const jsonDev = {id:1, imageUrl:"img1.jpg", firstName: "first", lastName: "last"};
    const developer = toDeveloper("/path/")(jsonDev, 0);
    assert.is(developer.id, 0);                                 // todo: later, it must be one
    assert.is(developer.img, "/path/img1.jpg");
    assert.is(developer.name, "first last");
});

jsonToModelSuite.add("dev-no-img", assert => {
    const jsonDev = {id:1, imageUrl:null, firstName: "first", lastName: "last"};
    const developer = toDeveloper("/path/")(jsonDev, 0);
    assert.is(developer.img, "/path/imgno.jpg");
});

jsonToModelSuite.run();
