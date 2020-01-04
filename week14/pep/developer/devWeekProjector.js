import {dom}                        from "../../util/dom.js";
import {Attribute, valueOf, VALUE}  from "../../presentationModel/presentationModel.js";
import {pctScale, assignMinHeightQualifier, availMinHeightQualifier, domIdForDevWeek, showDroppable} from "../helper.js";

export { devWeekProjector }

const devWeekProjector = (dev, week, occupationController, root) => {

    const devId  = valueOf(dev.id);
    const weekId = valueOf(week.id);

    // view: the holder element that contains both, the availability and the assignments for a dev this week

    const weekElement = dom(`<div class="week developer" id="${domIdForDevWeek(devId, weekId)}"></div>`);
    root.appendChild(weekElement);

    // binding onto a derived value with the help of qualifiers (stable binding per dev/week)
    // the actual min height is the maximum of availability vs the sum of all assignments

    const availMinHeightAttribute  = Attribute(0, availMinHeightQualifier(devId, weekId));
    const assignMinHeightAttribute = Attribute(0, assignMinHeightQualifier(devId, weekId));

    availMinHeightAttribute.getObs(VALUE).onChange( availMinHeight => {
        weekElement.style['height'] = pctScale( Math.max(availMinHeight, valueOf(assignMinHeightAttribute)) );
    });

    assignMinHeightAttribute.getObs(VALUE).onChange( assignMinHeight => {
        weekElement.style['height'] = pctScale( Math.max(assignMinHeight, valueOf(availMinHeightAttribute)));
    });

    // bind: assignment is dropped here -> update the assignment observables

    weekElement.ondrop = evt => {
        const data = evt.dataTransfer.getData("text/json");
        if (!data) return;
        const dragData = JSON.parse(data);
        if (dragData.assignmentId == null) return;
        evt.preventDefault();
        evt.target.classList.remove("drop");

        const assignment = occupationController.findById(dragData.assignmentId);

        if (assignment) {
            assignment.devId.getObs(VALUE).setValue(devId);
            assignment.weekId.getObs(VALUE).setValue(weekId);
        } else {
            console.log("Could not find assignment with id", dragData.assignmentId)
        }
    };
    showDroppable(weekElement);

};
