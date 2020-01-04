import {dom}                from "../../util/dom.js";
import {mouseDragStarter}   from "../mouseDrag.js";
import {Attribute, valueOf, VALUE}     from "../../presentationModel/presentationModel.js";

import {needMinHeightQualifier, domIdForProjectWeek, pctScale} from "../helper.js"

export {needProjector}

const needProjector = (needController, root) => {

    const needMinHeightAttribute = Attribute(0);

    const updateMinHeight = (projId, weekId, value) => {
        needMinHeightAttribute.setQualifier(needMinHeightQualifier(projId, weekId));
        needMinHeightAttribute.getObs(VALUE).setValue(value);
    };

    needController.onNeedAdded ( need => {

        const domId  = domIdForProjectWeek(valueOf(need.projectId), valueOf(need.weekId) );
        const parent = root.querySelector("#"+domId);

        const needElement = dom(`<div class="soll"> </div>`);

        // bind mouse move  ->  need value change
        needElement.onmousedown = mouseDragStarter(need.ftePct.getObs(VALUE));

        // bind attr change -> style height change
        need.ftePct.getObs(VALUE).onChange( newVal => {
            needElement.style['height'] = pctScale(newVal);
            needElement.innerText = (newVal / 100) + " FTEs";
            updateMinHeight( valueOf(need.projectId), valueOf(need.weekId), newVal)
        });

        parent.appendChild(needElement);
    });

    // note: we never remove needs - even when they are set to 0 - such that they can rise again

};
