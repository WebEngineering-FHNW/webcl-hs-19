import {ObservableList}                     from "../../observable/observable.js";
import {VALUE, valueOf,QualifiedAttribute } from "../../presentationModel/presentationModel.js";

import {Assignment}                         from "./assignmentModel.js";

export {StaffingController}

let id = 0; // local singleton state to generate unique ids for view purposes

const StaffingController = devController => {

    const innerList      = []; // local state, never exposed
    const staffings = ObservableList(innerList);

    /** @param {Assignment} assignmentData */
    const addAssignment = assignmentData => {
        const staffing = Assignment();
        const staffId = id++;
        staffing.id         .getObs(VALUE).setValue(staffId);              // the id should never change
        staffing.weekId     .getObs(VALUE).setValue(assignmentData.week);
        staffing.devId      .getObs(VALUE).setValue(assignmentData.devId);
        staffing.projId     .getObs(VALUE).setValue(assignmentData.projId);
        staffing.amountPct  .getObs(VALUE).setValue(assignmentData.amount);

        // setting value to 0 removes the assignment and notifies remove-listener
        staffing.amountPct.getObs(VALUE).onChange( newAmount => {
            if (0 === newAmount) {
                staffings.del(staffing);
            }
        });

        staffing.id         .setQualifier(`Assignment.${staffId}.id`);
        staffing.weekId     .setQualifier(`Assignment.${staffId}.weekId`);
        staffing.devId      .setQualifier(`Assignment.${staffId}.devId`);
        staffing.projId     .setQualifier(`Assignment.${staffId}.projId`);
        staffing.amountPct  .setQualifier(`Assignment.${staffId}.amountPct`);

        staffing.developerName = QualifiedAttribute(`Assignment.${staffId}.developerName`);

        staffing.devId.getObs(VALUE).onChange( newDevId =>
             staffing.developerName.getObs(VALUE).setValue( valueOf( devController.findById(newDevId).name  ) )
        );

        staffings.add(staffing);
    };

    const findById = assignmentId =>
        innerList.find( assignment => assignment.id.getObs(VALUE).getValue() === assignmentId);

    const findAllByProjIdAndWeekId = (projId, weekId) =>
        innerList.filter( assignment =>
                assignment.projId.getObs(VALUE).getValue() === projId
             && assignment.weekId.getObs(VALUE).getValue() === weekId);

    return {
        addAssignment,
        removeAssignment:     staffings.del,
        onAssignmentAdded:    staffings.onAdd,
        onAssignmentRemoved:  staffings.onDel,
        findAllByProjIdAndWeekId,
        findById
    }
};
