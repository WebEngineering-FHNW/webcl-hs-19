import {ObservableList}                     from "../../observable/observable.js";
import {QualifiedAttribute, VALUE, valueOf} from "../../presentationModel/presentationModel.js";

import {Assignment}                         from "./assignmentModel.js";

export {OccupationController}

let id = 0; // local singleton state to generate unique ids for view purposes

const OccupationController = projController => {

    const innerList      = []; // local state, never exposed
    const occupations = ObservableList(innerList);

    /** @param {Assignment} assignmentData */
    const addAssignment = assignmentData => {
        const occupation = Assignment();
        const occupationId = id++;
        occupation.id.getObs(VALUE)       .setValue(occupationId);
        occupation.weekId.getObs(VALUE)   .setValue(assignmentData.week);
        occupation.devId.getObs(VALUE)    .setValue(assignmentData.devId);
        occupation.projId.getObs(VALUE)   .setValue(assignmentData.projId);
        occupation.amountPct.getObs(VALUE).setValue(assignmentData.amount);

        // setting value to 0 removes the assignment and notifies remove-listener
        occupation.amountPct.getObs(VALUE).onChange( newAmount => {
            if (0 === newAmount) {
                occupations.del(occupation);
            }
        });

        occupation.id.setQualifier(`Assignment.${occupationId}.id`);
        occupation.weekId.setQualifier(`Assignment.${occupationId}.weekId`);
        occupation.devId.setQualifier(`Assignment.${occupationId}.devId`);
        occupation.projId.setQualifier(`Assignment.${occupationId}.projId`);
        occupation.amountPct.setQualifier(`Assignment.${occupationId}.amountPct`);

        occupation.projectName  = QualifiedAttribute(`Assignment.${occupationId}.projectName`);
        occupation.projectColor = QualifiedAttribute(`Assignment.${occupationId}.projectColor`);

        occupation.projId.getObs(VALUE).onChange(projId => {
            const project = projController.findById(projId);
            occupation.projectName.getObs(VALUE).setValue(valueOf(project.name));
            occupation.projectColor.getObs(VALUE).setValue(valueOf(project.color));
        });

        occupations.add(occupation);
    };

    const findById = assignmentId =>
        innerList.find( assignment => assignment.id.getObs(VALUE).getValue() === assignmentId);

    const findAllByDevIdAndWeekId = (devId, weekId) =>
        innerList.filter( assignment =>
                assignment.devId .getObs(VALUE).getValue() === devId
             && assignment.weekId.getObs(VALUE).getValue() === weekId);

    return {
        addAssignment,
        removeAssignment:     occupations.del,
        onAssignmentAdded:    occupations.onAdd,
        onAssignmentRemoved:  occupations.onDel,
        findAllByDevIdAndWeekId,
        findById
    }
};
