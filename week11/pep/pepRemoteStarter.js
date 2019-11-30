
import { pepServices } from "./service/remoteService.js";
import { start }  from "./pep.js";

// use data as provided from view through the window object:
const URL   = `http://${grailsServerName}:${grailsServerPort}${restPath}`;
const appRootId = window.appRootId;

pepServices(URL, "/static/pep/img/").loadDevelopers( devs => start(appRootId, devs) );


