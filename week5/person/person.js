import { ObservableList, Observable }                       from "../observable/observable.js";
import { Attribute, LABEL }                                 from "../presentationModel/presentationModel.js";
import { listItemProjector, formProjector }     from "./personProjector.js";

export { MasterController, MasterView, SelectionController, DetailView, Person, NoPerson }

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

const MasterController = modelConstructor => {

    const listModel = ObservableList([]); // observable array of models, this state is private

    return {
        addModel:            () => listModel.add(modelConstructor()),
        removeModel:         listModel.del,
        onModelAdd:          listModel.onAdd,
        onModelRemove:       listModel.onDel,
    }
};


// View-specific parts

const MasterView = (masterController, selectionController, rootElement) => {

    const render = person =>
        listItemProjector(masterController, selectionController, rootElement, person, ALL_ATTRIBUTE_NAMES);

    // binding
    masterController.onModelAdd(render);
};

const NoPerson = (() => { // one time creation, singleton
    const johnDoe = Person();
    johnDoe.firstname.setConvertedValue("");
    johnDoe.lastname.setConvertedValue("");
    return johnDoe;
})();

const SelectionController = noSelection => {

    const selectedModelObs = Observable(noSelection);

    return {
        setSelectedModel : selectedModelObs.setValue,
        getSelectedModel : selectedModelObs.getValue,
        onModelSelected:   selectedModelObs.onChange,
        clearSelection:     () => selectedModelObs.setValue(noSelection),
    }
};


const DetailView = (selectionController, rootElement) => {

    const render = person =>
        formProjector(selectionController, rootElement, person, ALL_ATTRIBUTE_NAMES);

    selectionController.onModelSelected(render);
};
