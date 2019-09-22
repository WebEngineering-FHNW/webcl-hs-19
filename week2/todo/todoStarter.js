
import {TodoController, TodoOpenView, TodoTotalView, TodoItemsView} from './todo.js';

const todoController = TodoController();

// binding of the main view

document.getElementById('plus').onclick    = _ => todoController.addTodo();
document.getElementById('fortune').onclick = _ => todoController.addFortuneTodo();

// create the sub-views, incl. binding

TodoItemsView(todoController, document.getElementById('todoContainer'));
TodoTotalView(todoController, document.getElementById('numberOfTasks'));
TodoOpenView (todoController, document.getElementById('openTasks'));

// init the model

todoController.addTodo();
