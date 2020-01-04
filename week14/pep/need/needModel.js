import {presentationModelFromAttributeNames} from "../../presentationModel/presentationModel.js";

export { Need, ALL_NEED_ATTRIBUTE_NAMES }

/**
 * @typedef  Need
 * @type     {object}
 * @property {!number} week    - id of the week; foreign key; mandatory; set only once.      // todo: -> weekId
 * @property {!number} projId  - id of the project; foreign key, mandatory; set only once. // todo: -> projectId
 * @property {!number} fte     - project needs so many full-time-equivalents this week; cannot be negative: mandatory.  // todo: -> ftePct
 * @example  {week:0, projId:0, fte:100}
 */

const ALL_NEED_ATTRIBUTE_NAMES = ['weekId', 'projectId', 'ftePct'];

const Need = () => presentationModelFromAttributeNames(ALL_NEED_ATTRIBUTE_NAMES);

