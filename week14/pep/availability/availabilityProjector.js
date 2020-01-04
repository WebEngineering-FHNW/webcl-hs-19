import {dom}                from "../../util/dom.js";
import {mouseDragStarter}   from "../mouseDrag.js";
import {Attribute, valueOf, VALUE}     from "../../presentationModel/presentationModel.js";

import {availMinHeightQualifier, domIdForDevWeek, pctScale} from "../helper.js"

export {availabilityProjector}


const availabilityProjector = (availabilityController, root) => {

    const availMinHeightAttribute = Attribute(0);

    const updateMinHeight = (devId, weekId, value) => {
        availMinHeightAttribute.setQualifier(availMinHeightQualifier(devId, weekId));
        availMinHeightAttribute.getObs(VALUE).setValue(value);
    };

    availabilityController.onAvailabilityAdded (availability => {

        const domId  = domIdForDevWeek(valueOf(availability.devId), valueOf(availability.weekId) );
        const parent = root.querySelector("#"+domId);

        const availElement = dom(`<div class="soll"> </div>`);

        // bind mouse move  ->  avail value change
        availElement.onmousedown = mouseDragStarter(availability.availPct.getObs(VALUE));

        // bind attr change -> style height change
        availability.availPct.getObs(VALUE).onChange( newVal => {
            availElement.style['height'] = pctScale(newVal);
            availElement.innerText = newVal + " %";
            updateMinHeight( valueOf(availability.devId), valueOf(availability.weekId), newVal)
        });

        parent.appendChild(availElement);
    });

    // note: we never remove availabilities - even when they are set to 0 - such that they can rise again

};
