import {presentationModelFromAttributeNames} from "../../presentationModel/presentationModel.js";

export { Assignment, ALL_ASSIGNMENT_ATTRIBUTE_NAMES }

/**
 * @typedef  Assignment
 * @type     {object}
 * @property {!number} id      - id of the assignment; mandatory; set only once.
 * @property {!number} week    - id of the week; foreign key; mandatory; mutable.      // todo: -> weekId
 * @property {!number} devId   - id of the developer; foreign key, mandatory; mutable.
 * @property {!number} projId  - id of the project; foreign key, mandatory; set only once. // todo: later, we might allow assignments to change projects (?)
 * @property {!number} amount  - percentage of work (FTE) that this dev is assigned for this week for this project;
 *                               cannot be negative: setting to 0 should remove the assignment; mandatory.  // todo: -> amountPct
 * @example  { week:0, devId:0, projId:0, amount: 70},
 */

const ALL_ASSIGNMENT_ATTRIBUTE_NAMES = ['id','weekId','devId','projId','amountPct'];

const Assignment = () => presentationModelFromAttributeNames(ALL_ASSIGNMENT_ATTRIBUTE_NAMES);

