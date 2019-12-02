
import { dom } from "../util/dom.js"
import {registerForMouseDrag, mouseDragStarter, startDnD} from "./mouseDrag.js";
import { propSum, pctScale, showDroppable} from "./helper.js";
import {PepController } from "./pepController.js";

export { start } ;

const start = (appRootId, devArray) => {

    const pepController = PepController();
    pepController.addDevs(devArray);

    const weeks     = pepController.weeks;
    const avails    = pepController.avails;
    const projects  = pepController.projects;
    const FTEs      = pepController.FTEs;
    const assignments = pepController.assignments;
    const devs      = pepController.devs;

    const render = () => {

        pepController.cleanZeroAssignments();

        const root = dom(`<div id="${appRootId}">`);

        // render header

        root.appendChild(dom('<div class="topic"></div>'));
        weeks.forEach(week => {
            root.appendChild(dom(`<div class="week"><div class="header">${week.label}</div></div>`));
        });

        // render devs

        devs.forEach(dev => {
            const devElement = dom(`<div class="topic developer" style="background-image:url(${dev.img})" draggable="true">${dev.name}</div>`);
            root.appendChild(devElement);

            devElement.ondragstart = evt => {
                evt.dataTransfer.setData("text/json", JSON.stringify( {devId : dev.id} ))
            };

            weeks.forEach(week => {
                // actual height is maximum of the sum of all assignments in this week or the availability
                const devThisWeek = it => it.week === week.id && it.devId === dev.id;
                const availModel = avails.find(devThisWeek);
                const avail = availModel ? availModel.avail : 0;
                const assignmentsThisWeek = assignments.filter(devThisWeek);
                const assignSum = propSum('amount', assignmentsThisWeek);
                const height = Math.max(avail, assignSum);
                const weekElement = dom(`<div class="week developer" id="dev_${dev.id}_week_${week.id}" style="height:${pctScale(height)};"></div>`);
                root.appendChild(weekElement);

                const availElement = dom(`<div class="soll" style="height:${pctScale(avail)};">${avail} %</div>`);
                weekElement.appendChild(availElement);

                availElement.onmousedown = mouseDragStarter({
                    movingValue:        avail,              // dev is available so many % this week
                    highlightElement:   availElement,       // the dom element representing avail
                    spaceElement:       weekElement,
                    presModel:          availModel,
                    propertyName:       'avail',
                });

                weekElement.ondrop = evt => {
                    const data = evt.dataTransfer.getData("text/json");
                    if(!data) return;
                    const dragData = JSON.parse(data);
                    if(dragData.projId == null) return;
                    evt.preventDefault();
                    evt.target.classList.remove("drop");
                    const assignment = assignments.find( it =>
                           it.week   === dragData.week
                        && it.devId  === dragData.devId
                        && it.projId === dragData.projId
                    );
                    if (assignment) {
                        assignment.week   = week.id;
                        assignment.devId  = dev.id;
                        render();
                    }
                };
                showDroppable(weekElement);

                assignmentsThisWeek.forEach(assignment => {
                    const project = projects.find(it => it.id === assignment.projId);
                    const assignElement = dom(
                        `<div class="assignment project"
                            draggable="true"
                            style="height:${pctScale(assignment.amount)}; --pid-color:${project.color}">
                                ${project.name}, ${assignment.amount}%
                        </div>`
                    );
                    assignElement.ondragstart = evt => {
                        startDnD();
                        evt.dataTransfer.setData("text/json", JSON.stringify(assignment))
                    };

                    assignElement.onmousedown = mouseDragStarter({
                        movingValue:        assignment.amount,  // dev is available so many % this week
                        highlightElement:   assignElement,      // the dom element representing avail
                        spaceElement:       weekElement,
                        presModel:          assignment,
                        propertyName:       'amount',
                    });
                    weekElement.appendChild(assignElement);
                })
            });
        });

        // render projects

        projects.forEach(project => {
            root.appendChild(dom(`<div class="topic project" style="--pid-color:${project.color}">${project.name}</div>`));
            weeks.forEach(week => {
                // actual height is maximum of the sum of all assignments in this week or the needed FTEs
                const projThisWeek = it => it.week === week.id && it.projId === project.id;
                const fteModel = FTEs.find(projThisWeek);
                const needed = fteModel ? fteModel.fte : 0;
                const assignmentsThisWeek = assignments.filter(projThisWeek);
                const assignSum = propSum('amount', assignmentsThisWeek);
                const height = Math.max(needed, assignSum);
                const weekElement = dom(`<div class="week project" id="proj_${project.id}_week_${week.id}" style="height:${pctScale(height)};"></div>`);
                root.appendChild(weekElement);

                const neededElement = dom(`<div class="soll" style="height:${pctScale(needed)};">${needed / 100} FTEs</div>`);
                weekElement.appendChild(neededElement);

                neededElement.onmousedown = mouseDragStarter({
                    movingValue:        needed,         // project needs so many FTEs this week
                    highlightElement:   neededElement,  // the dom element representing needed
                    spaceElement:       weekElement,
                    presModel:          fteModel,
                    propertyName:       'fte',
                });

                weekElement.ondrop = evt => {
                    const data = evt.dataTransfer.getData("text/json");
                    if(!data) return;
                    const dragData = JSON.parse(data);
                    if(dragData.devId == null) return;
                    evt.preventDefault();
                    evt.target.classList.remove("drop");
                    const assignment = assignmentsThisWeek.find( it => it.devId  === dragData.devId );
                    if (assignment) {
                        // if we already have an assignment for this dev, this week, there is nothing to do
                        return;
                    }
                    if (dragData.projId != null) {
                        // it is not allowed to d&d between projects or weeks in the project view
                        return;
                    }
                    assignments.push({
                         week:      week.id,
                         devId:     dragData.devId,
                         projId:    project.id,
                         amount:    100 // we could be more sophisticated here and find out the remaining availability
                     });
                    render();
                };
                showDroppable(weekElement);

                assignmentsThisWeek.forEach(assignment => {
                    const assignElement = dom(
                        `<div class="assignment developer" style="height:${pctScale(assignment.amount)};">
                        ${devs.find(it => it.id === assignment.devId).name}, ${assignment.amount}%
                     </div>`
                    );
                    weekElement.appendChild(assignElement);
                })
            });
        });

        const topicsOverWeeks = document.getElementById(appRootId);
        topicsOverWeeks.replaceWith(root);
    };

    registerForMouseDrag( render );

    render();
};
