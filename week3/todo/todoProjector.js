
export { todoItemProjector }

const todoTextProjector = todo => {

    const inputElement = document.createElement("INPUT");
    inputElement.type = "text";
    inputElement.size = 42;

    inputElement.oninput = _ => todo.setText(inputElement.value);

    todo.onTextChanged(_ => inputElement.value = todo.getText());

    todo.onTextValidChanged(
        valid => valid
          ? inputElement.classList.remove("invalid")
          : inputElement.classList.add("invalid")
    );

    todo.onTextEditableChanged(
        isEditable => isEditable
        ? inputElement.removeAttribute("readonly")
        : inputElement.setAttribute("readonly", true));

    return inputElement;
};

const todoDoneProjector = todo => {

    const checkboxElement = document.createElement("INPUT");
    checkboxElement.type = "checkbox";

    checkboxElement.onclick = _ => todo.setDone(checkboxElement.checked);

    todo.onDoneChanged(
        done => done
        ? checkboxElement.setAttribute("checked", true)
        : checkboxElement.removeAttribute("checked")
    );

    return checkboxElement;
};

const todoItemProjector = (todoController, rootElement, todo) => {

    const deleteButton      = document.createElement("Button");
    deleteButton.setAttribute("class","delete");
    deleteButton.innerHTML  = "&times;";
    deleteButton.onclick    = _ => todoController.removeTodo(todo);

    const inputElement      = todoTextProjector(todo);
    const checkboxElement   = todoDoneProjector(todo);

    todoController.onTodoRemove( (removedTodo, removeMe) => {
        if (removedTodo !== todo) return;
        rootElement.removeChild(deleteButton);
        rootElement.removeChild(inputElement);
        rootElement.removeChild(checkboxElement);
        removeMe();
    } );

    rootElement.appendChild(deleteButton);
    rootElement.appendChild(inputElement);
    rootElement.appendChild(checkboxElement);
};
