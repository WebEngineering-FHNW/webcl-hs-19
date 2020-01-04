import {presentationModelFromAttributeNames, LABEL} from "../../presentationModel/presentationModel.js";

export { Week, labelObs, ALL_WEEK_ATTRIBUTE_NAMES }

/**
 * @typedef  Week
 * @type     {object}
 * @property {!number} id   - unique integer number; mandatory.
 * @property {string}  label - the text that identifies this week, e.g. "Week 31".
 * @example  {id: 0, label:'Week 31'}
 */

const ALL_WEEK_ATTRIBUTE_NAMES = ['id'];

// We model the label as the label observable of the id attribute (a bit unconventional but it saves memory)
const labelObs = week => week.id.getObs(LABEL);

const Week = () => presentationModelFromAttributeNames(ALL_WEEK_ATTRIBUTE_NAMES);


