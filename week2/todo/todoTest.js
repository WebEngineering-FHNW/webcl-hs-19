import { TodoController, TodoItemsView, TodoTotalView, TodoOpenView}  from "./todo.js"
import { Suite }                from "../test/test.js";

const todoSuite = Suite("todo");

todoSuite.add("todo-crud", assert => {

    // setup
    const todoContainer = document.createElement("div");
    const numberOfTasks = document.createElement("span");
    numberOfTasks.innerText = '0';
    const openTasks = document.createElement("span");
    openTasks.innerText = '0';

    const todoController = TodoController();

    TodoItemsView(todoController, todoContainer);  // three views that share the same controller and thus model
    TodoTotalView(todoController, numberOfTasks);
    TodoOpenView (todoController, openTasks);

    const elementsPerRow = 3;

    assert.is(todoContainer.children.length, 0*elementsPerRow);
    assert.is(numberOfTasks.innerText, '0');
    assert.is(openTasks.innerText, '0');

    todoController.addTodo();

    assert.is(todoContainer.children.length, 1*elementsPerRow);
    assert.is(numberOfTasks.innerText, '1');
    assert.is(openTasks.innerText, '1');

    todoController.addTodo();

    assert.is(todoContainer.children.length, 2*elementsPerRow);
    assert.is(numberOfTasks.innerText, '2');
    assert.is(openTasks.innerText, '2');

    const firstCheckbox = todoContainer.querySelectorAll("input[type=checkbox]")[0];
    assert.is(firstCheckbox.checked, false);

    firstCheckbox.click();

    assert.is(firstCheckbox.checked, true);

    assert.is(todoContainer.children.length, 2*elementsPerRow); // did not change
    assert.is(numberOfTasks.innerText, '2');                    // did not change
    assert.is(openTasks.innerText, '1');                        // changed

    // add a test for the deletion of a todo-item

    // delete a checked item

    const firstDeleteBtn = todoContainer.querySelectorAll("button.delete")[0];
    firstDeleteBtn.click();

    assert.is(todoContainer.children.length, 1*elementsPerRow);
    assert.is(numberOfTasks.innerText, '1');
    assert.is(openTasks.innerText, '1');      // remains!

    // delete an unchecked item

    const secondDeleteBtn = todoContainer.querySelectorAll("button.delete")[0];
    secondDeleteBtn.click();

    assert.is(todoContainer.children.length, 0*elementsPerRow);
    assert.is(numberOfTasks.innerText, '0');
    assert.is(openTasks.innerText, '0');      // changes

});

todoSuite.add("todo-memory-leak", assert => {  // variant with remove-me callback
    const todoController = TodoController();

    todoController.onTodoAdd(todo => {
       todoController.onTodoRemove( (todo, removeMe) => {
           removeMe(); // un- / comment to see the difference
       });
    });

    for (let i=0; i<10000; i++){   // without removeMe:  10000 : 2s, 20000: 8s, 100000: ???s
        const todo = todoController.addTodo();
        todoController.removeTodo(todo);
    }
});

todoSuite.add("todo-memory-leak-2", assert => {  // variant with listener identity
    const todoController = TodoController();

    todoController.onTodoAdd(todo => {

       const removeListener = todo => {
           // do the normal stuff, e.g. remove view elements
           // then remove yourself
           todoController.removeTodoRemoveListener(removeListener);
       };
       todoController.onTodoRemove( removeListener );
    });

    for (let i=0; i<10000; i++){
        const todo = todoController.addTodo();
        todoController.removeTodo(todo);
    }
});

todoSuite.run();
