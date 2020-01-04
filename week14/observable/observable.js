
export {Observable, ObservableList}

/**
 * @type    {object}
 * @typedef {{getValue: (function(): *), onChange: onChange, setValue: setValue}} Observable
 */

/**
 * @param value
 * @return {Observable}
 * @constructor
 */
const Observable = value => {
    const listeners = [];
    return {
        onChange: callback => {
            listeners.push(callback);
            if (listeners.length > 3) {
                console.debug("log listener count suspicious: ", listeners.length);
            }
            callback(value, value);
        },
        getValue: ()       => value,
        setValue: newValue => {
            if (value === newValue) return;
            const oldValue = value;
            value = newValue;
            listeners.forEach(callback => callback(value, oldValue));
        }
    }
};


const ObservableList = list => {
    const addListeners = [];
    const delListeners = [];
    const removeAt     = array => index => array.splice(index, 1);
    const removeItem   = array => item  => { const i = array.indexOf(item); if (i>=0) removeAt(array)(i); };
    const listRemoveItem     = removeItem(list);
    const delListenersRemove = removeAt(delListeners);
    return {
        onAdd: listener => addListeners.push(listener),
        onDel: listener => delListeners.push(listener),
        add: item => {
            list.push(item);
            addListeners.forEach( listener => listener(item));
            return item;
        },
        del: item => {
            const r = listRemoveItem(item);
            const safeIterate = [...delListeners]; // shallow copy as we might change listeners array while iterating
            safeIterate.forEach( (listener, index) => listener(item, () => delListenersRemove(index) ));
        },
        removeDeleteListener: removeItem(delListeners),
        count:   ()   => list.length,
        countIf: pred => list.reduce( (sum, item) => pred(item) ? sum + 1 : sum, 0)
    }
};
