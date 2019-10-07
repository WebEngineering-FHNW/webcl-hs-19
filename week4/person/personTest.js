
import { MasterController, SelectionController, MasterView, DetailView } from './person.js';
import { Suite }                from "../test/test.js";

const personSuite = Suite("person");

personSuite.add("crud", assert => {

    // setup
    const masterContainer = document.createElement("div");
    const detailContainer = document.createElement("div");
    detailContainer.innerHTML = "<div>to replace</div>";

    const masterController    = MasterController();
    const selectionController = SelectionController();

    // create the sub-views, incl. binding

    MasterView(masterController, selectionController, masterContainer);
    DetailView(selectionController, detailContainer);

    const elementsPerRow = 3;

    assert.is(masterContainer.children.length, 0*elementsPerRow);

    masterController.addPerson();

    assert.is(masterContainer.children.length, 1*elementsPerRow);

    masterController.addPerson();

    assert.is(masterContainer.children.length, 2*elementsPerRow);

    const firstInput = masterContainer.querySelectorAll("input[type=text]")[0];
    const firstDeleteButton = masterContainer.querySelectorAll("button")[0];

    firstDeleteButton.click();

    assert.is(masterContainer.children.length, 1*elementsPerRow);


});

// todo: test for memory leak (difficult)

personSuite.run();
