import {presentationModelFromAttributeNames} from "../../presentationModel/presentationModel.js";

export { Developer, ALL_DEVELOPER_ATTRIBUTE_NAMES }

/**
 * @typedef Developer
 * @type     {object}
 * @property {!number} id   - unique integer number; mandatory.
 * @property {?string} img  - path to an image that displays the developer; optional.
 * @property {string}  name - composed full name; might be empty.
 * @example  {id:0, img:"img/img0.jpg", name: "Dierk König"}
 */

const ALL_DEVELOPER_ATTRIBUTE_NAMES = ['id','name','img'];

const Developer = () => presentationModelFromAttributeNames(ALL_DEVELOPER_ATTRIBUTE_NAMES);

