import {dom}                from "../../util/dom.js";
import {VALUE, valueOf }    from "../../presentationModel/presentationModel.js";
import {devWeekProjector}   from "./devWeekProjector.js";

export { developerProjector }

const developerProjector = (developerController, weekController, assignmentController, root) => {

    developerController.onDeveloperAdded( developer => {

        // view

        const devElement = dom(`<div class="topic developer" draggable="true">...</div>`);
        root.appendChild(devElement); // later, we might prefer adding after the last preceding dev/week element if any

        // binding

        developer.img.getObs(VALUE).onChange( imageUrl =>
           devElement.style['background-image'] = `url(${imageUrl})`
        );
        developer.name.getObs(VALUE).onChange( name =>{
           devElement.innerText = name;
        });

        devElement.ondragstart = evt => {
            evt.dataTransfer.setData("text/json", JSON.stringify( {devId : valueOf(developer.id)} ))
        };

        weekController.eachWeek( week => {
            devWeekProjector(developer, week, assignmentController, root);
        });
    });


    // todo later: on developer removed


};
