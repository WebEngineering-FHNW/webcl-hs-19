import {client}      from "../../rest/restClient.js";
import {toDeveloper} from "./jsonToModel.js";

export { pepServices }

const pepServices = (URL, imagePath) => {

    const loadDevelopers = withDevelopers =>
        client(URL)
        .then(json => {
            // console.log("All devs:", JSON.stringify(json));
            const devs = json.map( toDeveloper(imagePath) );
            withDevelopers(devs);
        })
        .catch( err => console.error(err));

    return { loadDevelopers }
};

