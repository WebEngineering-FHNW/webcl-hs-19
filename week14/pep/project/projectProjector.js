import {dom}                from "../../util/dom.js";
import {VALUE}              from "../../presentationModel/presentationModel.js";
import {projectWeekProjector}   from "./projectWeekProjector.js";

export { projectProjector }

const projectProjector = (projectController, weekController, staffingController, newAssignmentCommand, root) => {

    projectController.onProjectAdded( project => {

        // view

        const projectElement = (dom(`<div class="topic project" style="--pid-color:transparent">Project Name</div>`));

        root.appendChild(projectElement);

        // binding

        project.color.getObs(VALUE).onChange( color => projectElement.style.setProperty('--pid-color', color));
        project.name.getObs(VALUE).onChange( name => projectElement.innerText = name);

        // there is currently no dragging of projects onto e.g. dev/weeks to create an assignment

        weekController.eachWeek( week =>
            projectWeekProjector(project, week, staffingController, newAssignmentCommand, root)
        );
    });

    // todo later: on project removed

};
