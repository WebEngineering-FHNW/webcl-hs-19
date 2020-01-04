import {dom}      from "../../util/dom.js";
import {labelObs} from "./weekModel.js";

export {weekProjector}

const weekProjector = (weekController, root) => {

    root.appendChild(dom('<div class="topic"></div>'));

    weekController.eachWeek( week => {
        // create view
        const $header = dom(`<div class="header">...</div>`);
        const $week   = dom(`<div class="week"></div>`);
        $week.appendChild($header);

        // binding
        labelObs(week).onChange(label => $header.innerText = label );

        root.appendChild($week);
    });
};
