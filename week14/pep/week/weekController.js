import {Week}         from "./weekModel.js";
import {VALUE, LABEL} from "../../presentationModel/presentationModel.js";

export {WeekController}

const WeekController = () => {

    const weeks = [];

    /** @param {Week} weekData */
    const addWeek = weekData => {
        const week = Week();
        week.id.getObs(VALUE).setValue(weekData.id);
        week.id.getObs(LABEL).setValue(weekData.label);
        weeks.push(week);
    };

    return {
        addWeek:        addWeek,
        eachWeek:       withWeek => weeks.forEach(withWeek),
    }
};
