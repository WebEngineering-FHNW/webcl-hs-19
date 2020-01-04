import {presentationModelFromAttributeNames} from "../../presentationModel/presentationModel.js";

export { Availability, ALL_AVAILABILITY_ATTRIBUTE_NAMES }

/**
 * @typedef Availability
 * @type     {object}
 * @property {!number} week   - id of the week; foreign key; mandatory; set only once.      // todo: -> weekId
 * @property {!number} devId  - id of the developer; foreign key, mandatory; set only once.
 * @property {!number} avail  - percentage of availability; cannot be negative: mandatory.  // todo: -> availPct
 * @example  {week:0, devId:0, avail:70}
 */

const ALL_AVAILABILITY_ATTRIBUTE_NAMES = ['weekId','devId','availPct'];

const Availability = () => presentationModelFromAttributeNames(ALL_AVAILABILITY_ATTRIBUTE_NAMES);

