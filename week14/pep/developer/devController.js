import {ObservableList} from "../../observable/observable.js";
import {Developer}      from "./devModel.js";
import {VALUE, valueOf} from "../../presentationModel/presentationModel.js";

export { DeveloperController }

const DeveloperController = () => {

    const innerList  = []; // internal use only
    const developers = ObservableList(innerList);

    /** @param {Developer} developerData */
    const addDeveloper = developerData => {
        const developer = Developer();

        developer.img.getObs(VALUE) .setValue(developerData.img);
        developer.name.getObs(VALUE).setValue(developerData.name);
        developer.id.getObs(VALUE)  .setValue(developerData.id);

        developers.add(developer);
    };

    const findById = developerId => innerList.find( developer => valueOf(developer.id) === developerId);

    return {
        addDeveloper,
        findById,
        removeDeveloper:     developers.del,
        onDeveloperAdded:    developers.onAdd,
        onDeveloperRemoved:  developers.onDel,
    }
};
