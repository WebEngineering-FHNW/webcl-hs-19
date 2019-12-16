import {Attribute, LABEL, VALUE} from "../presentationModel/presentationModel.js";
import {formProjector, listItemProjector, selectListItemForModel, removeListItemForModel, pageCss} from "./instantUpdateProjector.js";

export { MasterView, DetailView, Person, selectionMold, reset, ALL_ATTRIBUTE_NAMES }

// page-style change, only executed once
const style = document.createElement("STYLE");
style.innerHTML = pageCss;
document.head.appendChild(style);

const ALL_ATTRIBUTE_NAMES = ['firstname', 'lastname'];

let idCounter = 0;
const nextId = () => idCounter++;

const Person = () => {                               // facade
    const id = nextId();
    const firstnameAttr = Attribute("Monika", `Person.${id}.firstname`);
    firstnameAttr.getObs(LABEL).setValue("First Name");

    const lastnameAttr  = Attribute("Mustermann", `Person.${id}.lastname`);
    lastnameAttr.getObs(LABEL).setValue("Last Name");

    // lastnameAttr.setConverter( input => input.toUpperCase() );  // enable for playing around
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
    listController.onModelRemove( (removedModel, removeMe) => {
        removeListItemForModel(ALL_ATTRIBUTE_NAMES)(removedModel);
        removedModel.firstname.setQualifier(undefined); // remove model attributes from model world
        removedModel.lastname.setQualifier(undefined);  // this could become more convenient
        selectionController.clearSelection();
    });
    selectionController.onModelSelected(selectListItemForModel(ALL_ATTRIBUTE_NAMES));
};

const reset = person => {
    person.firstname.setQualifier(undefined);
    person.lastname.setQualifier(undefined);
    person.firstname.setConvertedValue("");
    person.lastname.setConvertedValue("");
    return person;
};

const selectionMold = reset(Person());

const DetailView = (selectionController, rootElement) => {

    formProjector(selectionController, rootElement, selectionMold, ALL_ATTRIBUTE_NAMES); // only once, view is stable, binding is stable

    selectionController.onModelSelected( selectedPersonModel => { // todo: make this generic

        // store current values of the selected model to display
        const firstnameValue = selectedPersonModel.firstname.getObs(VALUE).getValue();
        const lastnameValue = selectedPersonModel.lastname.getObs(VALUE).getValue();

        // set the qualifiers to connect detailModel with current selection
        // this will temporarily set the values of the current selection to the values of the detailModel
        selectionMold.lastname.setQualifier(selectedPersonModel.lastname.getQualifier());
        selectionMold.firstname.setQualifier(selectedPersonModel.firstname.getQualifier());

        // set the current values
        selectionMold.lastname.getObs(VALUE).setValue(lastnameValue);
        selectionMold.firstname.getObs(VALUE).setValue(firstnameValue);
    });
};
