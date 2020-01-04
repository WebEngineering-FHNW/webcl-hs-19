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
 * @type Observable
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
        if (dragInfo) dragInfo.setValue( 5 * Math.round(dragInfo.getValue() / 5));
        dragInfo = null;
        document.querySelectorAll(".soll").forEach(el => el.classList.remove("live"));
        document.querySelectorAll(".assignment").forEach(el => el.setAttribute('draggable','true'));
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

    // dragging upwards means increasing the value.
    document.onmousemove = evt => {
        if (!dragIsOn) return;
        if (!dragInfo) return;
        dragInfo.setValue( Math.max(0, dragInfo.getValue() - evt.movementY ));
    };
    document.onmouseup = finishDrag;
};

/**
 * @param {Observable} payload
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
