import {dom}                           from "../../util/dom.js";
import {mouseDragStarter, startDnD}    from "../mouseDrag.js";
import {Attribute, valueOf, VALUE}     from "../../presentationModel/presentationModel.js";

import {assignMinHeightQualifier, domIdForDevWeek, pctScale} from "../helper.js"

export {occupationProjector}

const padding = 8 + 8; // assignment divs have so much padding top + bottom

const occupationProjector = (occupationController, root) => {

    const findParent = (devId, weekId) => root.querySelector("#"+domIdForDevWeek(devId,weekId));

    const assignMinHeightAttribute = Attribute(0);

    const updateMinHeight = (devId, weekId) => {
        const assignments = occupationController.findAllByDevIdAndWeekId(devId, weekId);
        const minHeightFromAssigns = assignments.reduce( (sum, assignment) => sum + valueOf(assignment.amountPct), 0 );
        assignMinHeightAttribute.setQualifier(assignMinHeightQualifier(devId, weekId));
        assignMinHeightAttribute.getObs(VALUE).setValue(minHeightFromAssigns);
    };

    occupationController.onAssignmentAdded (occupation => {

        const initialParent = findParent( valueOf(occupation.devId), valueOf(occupation.weekId) );

        // create the view
        const occupationElement = dom(
            `<div class="assignment project" draggable="true">                
                <span class="projectName"></span>,
                <span class="amount"></span>&nbsp;%                
            </div>`
        );
        const projNameElement = occupationElement.querySelector(".projectName");
        const amountElement   = occupationElement.querySelector(".amount");

        // bindings

        occupation.projectColor.getObs(VALUE).onChange( newColor => occupationElement.style.setProperty('--pid-color', newColor))  ;
        occupation.projectName.getObs(VALUE).onChange(  newName  => projNameElement.innerText = newName);

        occupationController.onAssignmentRemoved( (removedAssignment, removeSelf) => {
            if(removedAssignment !== occupation) { return; }
            occupationElement.parentElement.removeChild(occupationElement);
            removeSelf(); // should not really be needed here, but better be defensive.
        });

        occupation.amountPct.getObs(VALUE).onChange( newVal => {
            occupationElement.style['min-height'] = pctScale(newVal - padding);
            amountElement.innerText = String(newVal);
            updateMinHeight(valueOf(occupation.devId), valueOf(occupation.weekId));
        });

        occupation.weekId.getObs(VALUE).onChange( (newWeekId, oldWeekId) => {
            if ( oldWeekId === newWeekId ) { return; } // happens on initial setting
            const newParent = findParent( valueOf(occupation.devId), newWeekId );
            const oldParent = occupationElement.parentElement;

            oldParent.removeChild(occupationElement);
            newParent.appendChild(occupationElement);

            updateMinHeight(valueOf(occupation.devId), newWeekId);
            updateMinHeight(valueOf(occupation.devId), oldWeekId);
        });

        occupation.devId.getObs(VALUE).onChange( (newDevId, oldDevId) => {
            if ( oldDevId === newDevId ) { return; } // happens on initial setting
            const newParent = findParent( newDevId, valueOf(occupation.weekId) );
            const oldParent = occupationElement.parentElement;

            oldParent.removeChild(occupationElement);
            newParent.appendChild(occupationElement);

            updateMinHeight(newDevId, valueOf(occupation.weekId));
            updateMinHeight(oldDevId, valueOf(occupation.weekId));
        });

        occupationElement.ondragstart = evt => {
            startDnD();
            evt.dataTransfer.setData("text/json", JSON.stringify({
                assignmentId: valueOf(occupation.id)
            }))
        };

        occupationElement.onmousedown = mouseDragStarter(occupation.amountPct.getObs(VALUE));

        initialParent.appendChild(occupationElement);
    });

};
