import {ObservableList} from "../../observable/observable.js";
import {VALUE}          from "../../presentationModel/presentationModel.js";

import {Need}   from "./needModel.js";

export {NeedController}

const NeedController = () => {

    const innerList      = []; // local state, never exposed
    const needs = ObservableList(innerList);

    /** @param {Need} needData */
    const addNeed = needData => {
        const need = Need();
        need.weekId.getObs(VALUE).setValue(needData.week);
        need.projectId.getObs(VALUE).setValue(needData.projId);
        need.ftePct.getObs(VALUE).setValue(needData.fte);
        needs.add(need);
    };

    const findByProjIdAndWeekId = (projId, weekId) =>
        innerList.find( need =>
                need.projectId.getObs(VALUE).getValue() === projId
             && need.weekId.getObs(VALUE).getValue() === weekId);

    return {
        addNeed:        addNeed,
        onNeedAdded:    needs.onAdd,
        findByProjIdAndWeekId
    }
};
