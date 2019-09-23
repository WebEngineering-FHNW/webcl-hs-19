
import { Observable } from "../observable/observable.js";
import { id }         from "../church/church.js";

export { Attribute }

const Attribute = value => {

    const valueObs = Observable(value);
    const validObs = Observable(true);

    let   convert           = id ;
    const setConverter      = converter => {
        convert = converter;
        setConvertedValue(value);
    };
    const setConvertedValue = val => valueObs.setValue(convert(val));

    const setValidator = validate => valueObs.onChange( val => validObs.setValue(validate(val)));

    return { valueObs, validObs, setValidator, setConverter, setConvertedValue }
};
