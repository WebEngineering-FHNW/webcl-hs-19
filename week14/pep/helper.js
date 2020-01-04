
export {
    pctScale,                   showDroppable,
    domIdForDevWeek,            domIdForProjectWeek,
    assignMinHeightQualifier,   availMinHeightQualifier,
    needMinHeightQualifier,     staffMinHeightQualifier,
}

/**
 * Scaling a percentage to pixels. For use in CSS property values.
 * @param   {number} pct - between 0 and 100 (can also be higher)
 * @returns {string} like "100px"
 */
const pctScale = pct => '' + pct + 'px';

const showDroppable = element => {
    element.ondragover = evt => {
        evt.preventDefault(); // allow drop
        evt.target.classList.add("drop");
    };
    element.ondragleave = evt => {
        evt.target.classList.remove("drop");
    };
};

const domIdForDevWeek          = (devId,  weekId) => `dev_${devId}_week_${weekId}`;
const domIdForProjectWeek      = (projId, weekId) => `proj_${projId}_week_${weekId}`;

const availMinHeightQualifier  = (devId, weekId) => `AvailabilityMinHeight.dev_${devId}.week_${weekId}`;
const assignMinHeightQualifier = (devId, weekId) => `AssignmentMinHeight.dev_${devId}.week_${weekId}`;

const needMinHeightQualifier  = (projId, weekId) => `NeedMinHeight.proj_${projId}.week_${weekId}`;
const staffMinHeightQualifier = (projId, weekId) => `StaffMinHeight.proj_${projId}.week_${weekId}`;
