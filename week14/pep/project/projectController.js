import {ObservableList} from "../../observable/observable.js";
import {VALUE, valueOf} from "../../presentationModel/presentationModel.js";

import {Project}        from "./projectModel.js";

export { ProjectController }

const ProjectController = () => {

    const innerList = [];
    const projects = ObservableList(innerList);

    /** @param {Project} projectData */
    const addProject = projectData => {
        const project = Project();
        project.id.getObs(VALUE)   .setValue(projectData.id);
        project.color.getObs(VALUE).setValue(projectData.color);
        project.name.getObs(VALUE) .setValue(projectData.name);
        projects.add(project);
    };

    const findById = projectId => innerList.find( project => valueOf(project.id) === projectId);

    return {
        addProject,
        findById,
        removeProject:     projects.del,
        onProjectAdded:    projects.onAdd,
        onProjectRemoved:  projects.onDel,
    }
};
