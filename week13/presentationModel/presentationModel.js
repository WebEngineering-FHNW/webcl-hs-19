
import { Observable } from "../observable/observable.js";
import { id }         from "../church/church.js";

export { Attribute,
         VALID, VALUE, EDITABLE, LABEL }

const VALUE    = "value";
const VALID    = "valid";
const EDITABLE = "editable";
const LABEL    = "label";

const ModelWorld = () => {

    const data = {}; // key -> array of observables

    const update = (getQualifier, name, observable) => {
        const qualifier = getQualifier(); // lazy get
        if (null == qualifier) { return; }
        const key = qualifier + "." + name; // example: "Person.4711.firstname" "VALID" -> "Person.4711.firstname.VALID"
        let candidates = data[key];
        if (null == candidates) {
            data[key] = [observable]; // nothing to notify
            return;
        }
        let found = false;
        candidates.forEach ( candidate => {
           if (candidate === observable) {
               found = true;
           } else {
               candidate.setValue(observable.getValue());
           }
        });
        if (! found) {
            candidates.push(observable);
        }
    };
    const updateQualifier = (qualifier, newQualifier, observables) => {
        for (let name in observables) {
            const observable = observables[name];
            if (null != qualifier) {
                // remove qualifier from old candidates
                const oldKey = qualifier + "." + name;
                const oldCandidates = data[oldKey];
                const foundIndex = oldCandidates.indexOf(observable);
                if (foundIndex > -1) {
                    oldCandidates.splice(foundIndex, 1);
                }
                if (oldCandidates.length === 0) { // delete empty candidates here
                    delete data[oldKey];
                }
            }
            if (null != newQualifier){
                // add to new candidates
                const newKey = newQualifier + "." + name;
                let newCandidates = data[newKey];
                if (null == newCandidates) {
                    newCandidates = data[newKey] = [];
                }
                newCandidates.push(observable);
            }
        }
        // after the structure is set, we trigger all updates to keep the values consistent
        // We do this in a second pass to deal more consistently with converters and validators.
        for (let name in observables) {
            const observable = observables[name];
            update( () => newQualifier, name, observable);
        }
    };
    return { update, updateQualifier }
};

const modelWorld = ModelWorld(); // make a single instance, not exported, this is currently a secret

const Attribute = (value, qualifier) => {

    const observables = {}; // name -> observable

    const getQualifier = () => qualifier;
    const setQualifier = newQualifier => { // todo: needs to update the model world indexes for all obs (key: qualifier + name)
        modelWorld.updateQualifier(qualifier, newQualifier, observables);
        qualifier = newQualifier;
    };

    const hasObs = name => observables.hasOwnProperty(name);

    const makeObservable = (name, initValue) => {
        const observable = Observable(initValue);
        observables[name] = observable;
        observable.onChange( val => modelWorld.update(getQualifier, name, observable) );
        return observable;
    };

    const getObs = (name, initValue = null) =>
        hasObs(name)
            ? observables[name]
            : makeObservable(name, initValue);

    getObs(VALUE, value); // initialize the value at least

    let   convert           = id ;
    const setConverter      = converter => {
        convert = converter;
        setConvertedValue(getObs(VALUE).getValue());
    };
    const setConvertedValue = val => getObs(VALUE).setValue(convert(val));

    // todo: this might set many validators without discharging old ones
    const setValidator = validate => getObs(VALUE).onChange( val => getObs(VALID).setValue(validate(val)));

    return { getObs, hasObs, setValidator, setConverter, setConvertedValue, getQualifier, setQualifier }
};
