
export { PepController } ;


const PepController = () => {

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
    const devs = [];

    const addDevs = devArray => devArray.forEach( dev => devs.push(dev));

    /**
     * Any assignment with an amount of 0 will be removed from the model.
     */
    const cleanZeroAssignments = () => {
        for (let foundIdx = -1; -1 < (foundIdx = assignments.findIndex(it => it.amount <= 0));) {
            assignments.splice(foundIdx, 1);
        }
    };

    return {
        addDevs,
        cleanZeroAssignments,
        weeks, avails, projects, FTEs, assignments, devs
    }

};
