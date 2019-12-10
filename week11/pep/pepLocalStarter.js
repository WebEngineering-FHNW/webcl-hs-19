
import { pepServices } from "./service/localService.js";
import { start }  from "./pep.js";

const appRootId = window.appRootId;

pepServices().loadDevelopers( devs => start(appRootId, devs) );


