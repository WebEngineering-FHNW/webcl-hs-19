import { pctScale} from "./helper.js";
export { registerForMouseDrag, mouseDragStarter, startDnD }

/**
 * Whether a drag operation is currently under way.
 * Modifiable state that is local to this module.
 * @type {boolean}
 */
let dragIsOn = false;

/**
 * The payload of the current drag. Null if there is no drag. Must be set on drag start operation.
 * Modifiable state that is local to this module.
 * @typedef {{presModel: *, propertyName: string, movingValue: (number), highlightElement: *, spaceElement: *}} DragInfo
 * @type DragInfo
 */
let dragInfo = null; // will be set on drag start

/**
 * Register all required key and mouse listeners.
 * @param onFinished Function that needs to be called when a drag operation has finished.
 */
const registerForMouseDrag = onFinished => {

    const finishDrag = evt => {
        if (!dragIsOn) return;
        dragIsOn = false;
        if (dragInfo) dragInfo.presModel[dragInfo.propertyName] = 5 * Math.round(dragInfo.movingValue / 5);
        dragInfo = null;
        // as long as we do re-rendering, this is not needed since render set's the initial defaults back
        // document.querySelectorAll(".soll").forEach(el => el.classList.remove("live"));
        // document.querySelectorAll(".assignment").forEach(el => el.setAttribute('draggable','true'));
        onFinished();
    };
    document.onkeydown = evt => {
        if (evt.shiftKey) {
            // shift enables dragging the assignment value, DnD must be disabled or it would interfere
            document.querySelectorAll(".assignment").forEach(el => el.setAttribute('draggable', 'false'));
            dragIsOn = true;
            return;
        }
        if (evt.altKey) {
            // alt enables dragging the "need fte" value
            document.querySelectorAll(".soll").forEach(el => el.classList.add("live"));
            dragIsOn = true;
            return;
        }
    };
    document.onkeyup = evt => {
        finishDrag();
    };

    document.onmousemove = evt => {
        if (!dragIsOn) return;
        if (!dragInfo) return;
        dragInfo.movingValue -= evt.movementY;
        dragInfo.movingValue = Math.max(0, dragInfo.movingValue);
        dragInfo.highlightElement.style.height = pctScale(dragInfo.movingValue);
        dragInfo.highlightElement.innerText = dragInfo.movingValue + " %";
        dragInfo.spaceElement.style.height = dragInfo.highlightElement.style.height;
    };
    document.onmouseup = finishDrag;
};

/**
 * @param {DragInfo} payload
 */
const mouseDragStarter = payload => evt => {
    if (!dragIsOn) return;
    dragInfo = payload;
};

/**
 * When a DnD operation starts, all other mouse drag operations must no longer be recognized.
 * @returns {boolean}
 */
const startDnD = () => dragIsOn = false;
