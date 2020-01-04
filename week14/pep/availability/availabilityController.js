import {ObservableList} from "../../observable/observable.js";
import {VALUE}          from "../../presentationModel/presentationModel.js";

import {Availability}   from "./availabilityModel.js";

export {AvailabilityController}

const AvailabilityController = () => {

    const innerList      = []; // local state, never exposed
    const availabilities = ObservableList(innerList);

    /** @param {Availability} availabilityData */
    const addAvailability = availabilityData => {
        const availability = Availability();
        availability.weekId.getObs(VALUE)  .setValue(availabilityData.week);
        availability.devId.getObs(VALUE)   .setValue(availabilityData.devId);
        availability.availPct.getObs(VALUE).setValue(availabilityData.avail);
        availabilities.add(availability);
    };

    const findByDevIdAndWeekId = (devId, weekId) =>
        innerList.find( availability =>
                availability.devId .getObs(VALUE).getValue() === devId
             && availability.weekId.getObs(VALUE).getValue() === weekId);


    return {
        addAvailability:        addAvailability,
        // eachAvailability:       withAvailability => innerList.forEach(withAvailability),
        // removeAvailability:     availabilities.del,
        onAvailabilityAdded:    availabilities.onAdd,
        // onAvailabilityRemoved:  availabilities.onDel,
        findByDevIdAndWeekId
    }
};
