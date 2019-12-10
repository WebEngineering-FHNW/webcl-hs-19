
export { propSum, pctScale, showDroppable}

/**
 * The sum of all values of the property referred to by {@param propname} for all entries in {@param array}
 * @param propname
 * @param array
 * @returns {number}
 */
const propSum = (propname, array) => array.reduce((accu, cur) => accu + cur[propname], 0);

/**
 * Scaling a percentage to pixels.
 * @param {number} pct - between 0 and 100
 * @returns {string}
 */
const pctScale = pct => '' + pct + 'px';

const showDroppable = element => {
    element.ondragover = evt => {
        evt.preventDefault(); // allow drop
        evt.target.classList.add("drop");
    };
    element.ondragleave = evt => {
        evt.target.classList.remove("drop");
    };
};
