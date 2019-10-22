/**
 * @module Controllers as shallow wrappers around observables
 */
import { ObservableList, Observable }                       from "../observable/observable.js";

export { ListController, SelectionController }

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
