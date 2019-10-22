import {EDITABLE, LABEL, VALID, VALUE} from "../presentationModel/presentationModel.js";

export { listItemProjector, formProjector, pageCss }

const masterClassName = 'instant-update-master'; // should be unique for this projector
const detailClassName = 'instant-update-detail';

const bindTextInput = (textAttr, inputElement) => {
    inputElement.oninput = _ => textAttr.setConvertedValue(inputElement.value);

    textAttr.getObs(VALUE).onChange(text => inputElement.value = text);

    textAttr.getObs(VALID, true).onChange(
        valid => valid
          ? inputElement.classList.remove("invalid")
          : inputElement.classList.add("invalid")
    );

    textAttr.getObs(EDITABLE, true).onChange(
        isEditable => isEditable
        ? inputElement.removeAttribute("readonly")
        : inputElement.setAttribute("readonly", true));

    textAttr.getObs(LABEL, '').onChange(label => inputElement.setAttribute("title", label));
};

const textInputProjector = textAttr => {

    const inputElement = document.createElement("INPUT");
    inputElement.type = "text";
    inputElement.size = 20;

    bindTextInput(textAttr, inputElement);

    return inputElement;
};

const listItemProjector = (masterController, selectionController, rootElement, model, attributeNames) => {

    if(rootElement.style['grid-template-columns'] === '') {
        rootElement.classList.add(masterClassName);
        const columStyle = '1.7em '+ attributeNames.map(x=>'auto').join(' ');
        rootElement.style['grid-template-columns'] = columStyle;
    };

    const deleteButton      = document.createElement("Button");
    deleteButton.setAttribute("class","delete");
    deleteButton.innerHTML  = "&times;";
    deleteButton.onclick    = _ => masterController.removeModel(model);

    const inputElements = [];

    attributeNames.forEach( attributeName => {
        const inputElement = textInputProjector(model[attributeName]);
        inputElement.onfocus = _ => selectionController.setSelectedModel(model);
        inputElements.push(inputElement);
    });

    selectionController.onModelSelected(
        selected => selected === model
          ? deleteButton.classList.add("selected")
          : deleteButton.classList.remove("selected")
    );

    masterController.onModelRemove( (removedModel, removeMe) => {
        if (removedModel !== model) return;
        rootElement.removeChild(deleteButton);
        inputElements.forEach( inputElement => rootElement.removeChild(inputElement));
        selectionController.clearSelection();
        removeMe();
    } );

    rootElement.appendChild(deleteButton);
    inputElements.forEach( inputElement => rootElement.appendChild(inputElement));
    selectionController.setSelectedModel(model);
};

const formProjector = (detailController, rootElement, model, attributeNames) => {

    const divElement = document.createElement("DIV");
    divElement.innerHTML = `
    <FORM>
        <DIV class="${detailClassName}">
        </DIV>
    </FORM>`;
    const detailFormElement = divElement.querySelector("." + detailClassName);

    attributeNames.forEach(attributeName => {
        const labelElement = document.createElement("LABEL"); // add view for attribute of this name
        labelElement.setAttribute("for", attributeName);
        const inputElement = document.createElement("INPUT");
        inputElement.setAttribute("TYPE", "text");
        inputElement.setAttribute("SIZE", "20");
        inputElement.setAttribute("ID", attributeName);
        detailFormElement.appendChild(labelElement);
        detailFormElement.appendChild(inputElement);

        bindTextInput(model[attributeName], inputElement);
        model[attributeName].getObs(LABEL, '').onChange(label => labelElement.textContent = label);
    });

    if (rootElement.firstChild) {
        rootElement.firstChild.replaceWith(divElement);
    } else {
        rootElement.appendChild(divElement);
    }
};


const pageCss = `
    .${masterClassName} {
        display:        grid;
        grid-column-gap: 0.5em;
        grid-template-columns: 1.7em auto auto; /* default: to be overridden dynamically */
        margin-bottom:  0.5em ;
    }
    .${detailClassName} {
        display:        grid;
        grid-column-gap: 0.5em;
        grid-template-columns: 1fr 3fr;
        margin-bottom:  0.5em ;
    }
`;
