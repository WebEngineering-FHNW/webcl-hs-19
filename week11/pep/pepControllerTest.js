
import { PepController } from "./pepController.js";
import { Suite} from "../test/test.js";

const pepControllerSuite = Suite("pepCtrl");

pepControllerSuite.add("zeroAssmt", assert => {
    const pepController = PepController();
    const assignments = pepController.assignments;
    assert.is (assignments.length, 2);
    pepController.cleanZeroAssignments();
    assert.is (assignments.length, 2); // no change

    assignments.push({amount: 0});
    assert.is (assignments.length, 3);
    assignments[1].amount = 0;         // critical: both last elements have amount == 0

    pepController.cleanZeroAssignments();
    assert.is (assignments.length, 1);
});

pepControllerSuite.add("addDevs", assert => {
    const pepController = PepController();
    const devs = pepController.devs;
    assert.is (devs.length, 0);

    pepController.addDevs( [ {id:0} ] );
    assert.is (devs.length, 1);
});

pepControllerSuite.run();
