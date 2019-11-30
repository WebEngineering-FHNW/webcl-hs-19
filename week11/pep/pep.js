
import { dom } from "../util/dom.js"
export { start } ;


const start = (appRootId, devs) => {

    const weeks = [
        {id: 0, label:'Week 31'},
        {id: 1, label:'Week 32'},
        {id: 2, label:'Week 33'},
        {id: 3, label:'Week 34'},
    ];


    const avails = [
        {week:0, devId:0, avail:70},
        {week:1, devId:0, avail:70},
        {week:2, devId:0, avail:100},
        {week:3, devId:0, avail:100},
        {week:0, devId:1, avail:100},
        {week:1, devId:1, avail:100},
        {week:2, devId:1, avail:100},
        {week:3, devId:1, avail:0},
    ];
    const projects = [
        {id:0, color: 'red',   name: "Personal Einsatz Planung"},
        {id:1, color: 'green', name: "Web Clients"},
    ];
    const FTEs = [
        {week:0, projId:0, fte:100},
        {week:1, projId:0, fte:150},
        {week:2, projId:0, fte:100},
        {week:3, projId:0, fte:100},
        {week:0, projId:1, fte:  0},
        {week:1, projId:1, fte: 50},
        {week:2, projId:1, fte:100},
        {week:3, projId:1, fte:  0},
    ];
    const assignments = [
        { week:0, devId:0, projId:0, amount: 70},
        { week:0, devId:0, projId:1, amount: 30},
    ];


    const propSum = (propname, array) => array.reduce((accu, cur) => accu + cur[propname], 0);
    const pctScale = pct => '' + pct + 'px';

    let dragIsOn = false;
    let dragInfo = null; // will be set on drag start

    const finishDrag = evt => {
        if (!dragIsOn) return;
        dragIsOn = false;
        if (dragInfo) dragInfo.presModel[dragInfo.propertyName] =  5 * Math.round(dragInfo.movingValue / 5);
        dragInfo = null;
        // as long as we do re-rendering, this is not needed since render set's the initial defaults back
        // document.querySelectorAll(".soll").forEach(el => el.classList.remove("live"));
        // document.querySelectorAll(".assignment").forEach(el => el.setAttribute('draggable','true'));
        render();
    };
    document.onkeydown = evt => {
        if (evt.shiftKey) {
            document.querySelectorAll(".assignment").forEach(el => el.setAttribute('draggable','false'));
            dragIsOn = true;
            return;
        }
        if (evt.altKey) {
            document.querySelectorAll(".soll").forEach(el => el.classList.add("live"));
            dragIsOn = true;
            return;
        }
    };
    document.onkeyup = evt => {
        finishDrag();
    };

    document.onmousemove = evt => {
        if (!dragIsOn) return;
        if (!dragInfo) return;
        dragInfo.movingValue -= evt.movementY;
        dragInfo.movingValue = Math.max(0, dragInfo.movingValue);
        dragInfo.highlightElement.style.height = pctScale(dragInfo.movingValue);
        dragInfo.highlightElement.innerText = dragInfo.movingValue + " %";
        dragInfo.spaceElement.style.height = dragInfo.highlightElement.style.height;
    };
    document.onmouseup = finishDrag;

    const render = () => {

        // clean zero-assignments
        for(let foundIdx = -1; -1 < (foundIdx = assignments.findIndex(it => it.amount <= 0)); ) {
            assignments.splice(foundIdx, 1);
        }

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

                availElement.onmousedown = evt => {
                    if (! dragIsOn) return;
                    dragInfo = {
                        movingValue: avail, // dev is available so many % this week
                        highlightElement: availElement, // the dom element representing avail
                        spaceElement: weekElement,
                        presModel: availModel,
                        propertyName: 'avail',
                    };
                };

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
                weekElement.ondragover = evt => {
                    evt.preventDefault(); // allow drop
                    evt.target.classList.add("drop");
                };
                weekElement.ondragleave = evt => {
                    evt.preventDefault(); // allow drop
                    evt.target.classList.remove("drop");
                };

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
                        dragIsOn = false;
                        evt.dataTransfer.setData("text/json", JSON.stringify(assignment))
                    };

                    assignElement.onmousedown = evt => {
                        if (!dragIsOn) return;
                        dragInfo = {
                            movingValue: assignment.amount, // dev is available so many % this week
                            highlightElement: assignElement, // the dom element representing avail
                            spaceElement: weekElement,
                            presModel: assignment,
                            propertyName: 'amount',
                        }
                    };
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

                neededElement.onmousedown = evt => {
                    if (!dragIsOn) return;
                    dragInfo = {
                        movingValue: needed, // project needs so many FTEs this week
                        highlightElement: neededElement, // the dom element representing needed
                        spaceElement: weekElement,
                        presModel: fteModel,
                        propertyName: 'fte',
                    }
                };

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
                weekElement.ondragover = evt => {
                    evt.preventDefault(); // allow drop
                    evt.target.classList.add("drop");
                };
                weekElement.ondragleave = evt => {
                    evt.preventDefault(); // allow drop
                    evt.target.classList.remove("drop");
                };

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
    }

    render();
};
