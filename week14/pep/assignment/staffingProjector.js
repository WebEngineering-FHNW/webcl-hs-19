import {dom}                           from "../../util/dom.js";
import {mouseDragStarter, startDnD}    from "../mouseDrag.js";
import {Attribute, valueOf, VALUE}     from "../../presentationModel/presentationModel.js";

import {staffMinHeightQualifier, domIdForProjectWeek, pctScale} from "../helper.js"

export {staffingProjector}

const padding = 8 + 8; // staffing divs have so much padding top + bottom // todo: check

const staffingProjector = (staffingController, root) => {

    const findParent = (projId, weekId) => root.querySelector("#"+domIdForProjectWeek(projId,weekId));

    const staffingMinHeightAttribute = Attribute(0);

    const updateMinHeight = (projId, weekId) => {
        const assignments = staffingController.findAllByProjIdAndWeekId(projId, weekId);
        const minHeightFromAssigns = assignments.reduce( (sum, assignment) => sum + valueOf(assignment.amountPct), 0 );
        staffingMinHeightAttribute.setQualifier(staffMinHeightQualifier(projId, weekId));
        staffingMinHeightAttribute.getObs(VALUE).setValue(minHeightFromAssigns);
    };

    staffingController.onAssignmentAdded (staffing => {

        const initialParent = findParent( valueOf(staffing.projId), valueOf(staffing.weekId) );

        // create the view

        const staffingElement = dom(
            `<div class="assignment developer" draggable="true">                
                <span class="developerName"></span>,
                <span class="amount"></span>&nbsp;%               
            </div>`
        );
        const devNameElement = staffingElement.querySelector(".developerName");
        const amountElement  = staffingElement.querySelector(".amount");

        // bindings

        staffing.developerName.getObs(VALUE).onChange(  newName  => {
            devNameElement.innerText = newName;
        });

        staffingController.onAssignmentRemoved( (removedAssignment, removeSelf) => {
            if(removedAssignment !== staffing) { return; }
            staffingElement.parentElement.removeChild(staffingElement);
            removeSelf(); // should not really be needed here, but better be defensive.
        });

        staffing.amountPct.getObs(VALUE).onChange( newVal => {
            staffingElement.style['min-height'] = pctScale(newVal - padding);
            amountElement.innerText = String(newVal);
            updateMinHeight(valueOf(staffing.projId), valueOf(staffing.weekId));
        });

        staffing.weekId.getObs(VALUE).onChange( (newWeekId, oldWeekId) => {
            if ( oldWeekId === newWeekId ) { return; } // happens on initial setting
            const newParent = findParent( valueOf(staffing.projId), newWeekId );
            const oldParent = staffingElement.parentElement;

            oldParent.removeChild(staffingElement);
            newParent.appendChild(staffingElement);

            updateMinHeight(valueOf(staffing.projId), newWeekId);
            updateMinHeight(valueOf(staffing.projId), oldWeekId);
        });

        staffing.projId.getObs(VALUE).onChange( (newProjId, oldProjId )=> {
            if ( oldProjId === newProjId ) { return; } // happens on initial setting
            const newParent = findParent( newProjId, valueOf(staffing.weekId) );
            const oldParent = staffingElement.parentElement;

            oldParent.removeChild(staffingElement);
            newParent.appendChild(staffingElement);

            updateMinHeight(newProjId, valueOf(staffing.weekId));
            updateMinHeight(oldProjId, valueOf(staffing.weekId));
        });

        staffingElement.ondragstart = evt => {
            startDnD();
            evt.dataTransfer.setData("text/json", JSON.stringify({
                assignmentId:  valueOf(staffing.id)
            }))
        };

        staffingElement.onmousedown = mouseDragStarter(staffing.amountPct.getObs(VALUE));

        initialParent.appendChild(staffingElement);
    });

};
