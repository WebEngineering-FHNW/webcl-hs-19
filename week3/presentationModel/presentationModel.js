
import { Observable } from "../observable/observable.js";
import { id }         from "../church/church.js";

export { Attribute,
         VALID, VALUE }

const VALUE = "value";
const VALID = "valid";

const Attribute = value => {

    const observables = {};

    const hasObs = name => observables.hasOwnProperty(name);

    const getObs = (name, initValue = null) =>
        hasObs(name)
            ? observables[name]
            : observables[name] = Observable(initValue);

    getObs(VALUE, value); // initialize the value at least

    let   convert           = id ;
    const setConverter      = converter => {
        convert = converter;
        setConvertedValue(value);
    };
    const setConvertedValue = val => getObs(VALUE).setValue(convert(val));

    const setValidator = validate => getObs(VALUE).onChange( val => getObs(VALID).setValue(validate(val)));

    return { getObs, hasObs, setValidator, setConverter, setConvertedValue }
};
