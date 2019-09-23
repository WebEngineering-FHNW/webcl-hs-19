import { ObservableList } from "../observable/observable.js";
import { Attribute }      from "../presentationModel/presentationModel.js";
import { Scheduler }      from "../dataflow/dataflow.js";
import { fortuneService } from "./fortuneService.js";

export { TodoController, TodoItemsView, TodoTotalView, TodoOpenView}

const TodoController = () => {

    const Todo = () => {                               // facade
        const textAttr = Attribute("text");
        const doneAttr = Attribute(false);

        textAttr.setConverter( input => input.toUpperCase() );
        textAttr.setValidator( input => input.length >= 3   );

        return {
            getDone:            doneAttr.valueObs.getValue,
            setDone:            doneAttr.valueObs.setValue,
            onDoneChanged:      doneAttr.valueObs.onChange,
            getText:            textAttr.valueObs.getValue,
            setText:            textAttr.setConvertedValue,
            onTextChanged:      textAttr.valueObs.onChange,
            onTextValidChanged: textAttr.validObs.onChange,
        }
    };

    const todoModel = ObservableList([]); // observable array of Todos, this state is private
    const scheduler = Scheduler();

    const addTodo = () => {
        const newTodo = Todo();
        todoModel.add(newTodo);
        return newTodo;
    };

    const addFortuneTodo = () => {

        const newTodo = Todo();

        todoModel.add(newTodo);
        newTodo.setText('...');

        scheduler.add( ok =>
           fortuneService( text => {
                   newTodo.setText(text);
                   ok();
               }
           )
        );

    };

    return {
        numberOfTodos:      todoModel.count,
        numberOfopenTasks:  () => todoModel.countIf( todo => ! todo.getDone() ),
        addTodo:            addTodo,
        addFortuneTodo:     addFortuneTodo,
        removeTodo:         todoModel.del,
        onTodoAdd:          todoModel.onAdd,
        onTodoRemove:       todoModel.onDel,
        removeTodoRemoveListener: todoModel.removeDeleteListener, // only for the test case, not used below
    }
};


// View-specific parts

const TodoItemsView = (todoController, rootElement) => {

    const render = todo => {

        function createElements() {
            const template = document.createElement('DIV'); // only for parsing
            template.innerHTML = `
                <button class="delete">&times;</button>
                <input type="text" size="42">
                <input type="checkbox">            
            `;
            return template.children;
        }
        const [deleteButton, inputElement, checkboxElement] = createElements();

        checkboxElement.onclick = _ => todo.setDone(checkboxElement.checked);
        deleteButton.onclick    = _ => todoController.removeTodo(todo);

        todoController.onTodoRemove( (removedTodo, removeMe) => {
            if (removedTodo !== todo) return;
            rootElement.removeChild(inputElement);
            rootElement.removeChild(deleteButton);
            rootElement.removeChild(checkboxElement);
            removeMe();
        } );

        inputElement.oninput = _ => todo.setText(inputElement.value);

        todo.onTextChanged(() => inputElement.value = todo.getText());

        todo.onTextValidChanged(
            valid => valid
              ? inputElement.classList.remove("invalid")
              : inputElement.classList.add("invalid")
        );

        rootElement.appendChild(deleteButton);
        rootElement.appendChild(inputElement);
        rootElement.appendChild(checkboxElement);
    };

    // binding

    todoController.onTodoAdd(render);

    // we do not expose anything as the view is totally passive.
};

const TodoTotalView = (todoController, numberOfTasksElement) => {

    const render = () =>
        numberOfTasksElement.innerText = "" + todoController.numberOfTodos();

    // binding

    todoController.onTodoAdd(render);
    todoController.onTodoRemove(render);
};

const TodoOpenView = (todoController, numberOfOpenTasksElement) => {

    const render = () =>
        numberOfOpenTasksElement.innerText = "" + todoController.numberOfopenTasks();

    // binding

    todoController.onTodoAdd(todo => {
        render();
        todo.onDoneChanged(render);
    });
    todoController.onTodoRemove(render);
};
