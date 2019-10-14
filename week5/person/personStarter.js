
import { MasterController, SelectionController, MasterView, DetailView, Person, NoPerson } from './person.js';

const masterController    = MasterController(Person);
const selectionController = SelectionController(NoPerson);

// create the sub-views, incl. binding

MasterView(masterController, selectionController, document.getElementById('masterContainer'));
DetailView(selectionController, document.getElementById('detailContainer'));

// binding of the main view

document.getElementById('plus').onclick    = _ => masterController.addModel();
