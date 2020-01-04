import {presentationModelFromAttributeNames} from "../../presentationModel/presentationModel.js";

export { Project, ALL_PROJECT_ATTRIBUTE_NAMES }

/**
 * @typedef  Project
 * @type     {object}
 * @property {!number} id    - unique integer number; mandatory.
 * @property {string}  color - css color that visually identifies the project;
 * @property {string}  name  - composed full name; might be empty.
 * @example  {id:1, color: 'green', name: "Web Clients"}
 */

const ALL_PROJECT_ATTRIBUTE_NAMES = ['id','color','name'];

const Project = () => presentationModelFromAttributeNames(ALL_PROJECT_ATTRIBUTE_NAMES);

