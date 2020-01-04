import {dom}                        from "../../util/dom.js";
import {Attribute, valueOf, VALUE}  from "../../presentationModel/presentationModel.js";
import {pctScale, staffMinHeightQualifier, needMinHeightQualifier, domIdForProjectWeek, showDroppable} from "../helper.js";

export { projectWeekProjector }

const projectWeekProjector = (project, week, staffingController, newAssignmentCommand, root) => {

    const projectId  = valueOf(project.id);
    const weekId     = valueOf(week.id);

    // view: the holder element that contains both, the need and the assignments for a project this week

    const weekElement = dom(`<div class="week project" id="${domIdForProjectWeek(projectId, weekId)}"></div>`);
    root.appendChild(weekElement);

    // binding onto a derived value with the help of qualifiers (stable binding per project/week)
    // the actual min height is the maximum of availability vs the sum of all assignments

    const needMinHeightAttribute  = Attribute(0, needMinHeightQualifier(projectId, weekId));
    const staffMinHeightAttribute = Attribute(0, staffMinHeightQualifier(projectId, weekId));

    needMinHeightAttribute.getObs(VALUE).onChange( needMinHeight => {
        weekElement.style['height'] = pctScale( Math.max(needMinHeight, valueOf(staffMinHeightAttribute)) );
    });

    staffMinHeightAttribute.getObs(VALUE).onChange( staffMinHeight => {
        weekElement.style['height'] = pctScale( Math.max(staffMinHeight, valueOf(needMinHeightAttribute)));
    });

    // bind: developer  is dropped here -> create a respective assignment
    //       assignment is dropped here -> update week and/or project
    weekElement.ondrop = evt => {
        const data = evt.dataTransfer.getData("text/json");
        if (!data) return;
        const dragData = JSON.parse(data);
        if (null == dragData.devId && null == dragData.assignmentId) return;
        evt.preventDefault();
        evt.target.classList.remove("drop");

        if (null != dragData.assignmentId) {                    // this is a drop from an existing assignment
            const assignment = staffingController.findById(dragData.assignmentId);
            assignment.weekId.getObs(VALUE).setValue(weekId);
            assignment.projId.getObs(VALUE).setValue(projectId);
        } else {                                                  // this is a drop from a developer
            newAssignmentCommand( {
                week    : weekId,
                devId   : dragData.devId,
                projId  : projectId,
                amount  : 100,  // we might want to be more intelligent here based on remaining need/avail
            });
        }
    };

    showDroppable(weekElement);
};
