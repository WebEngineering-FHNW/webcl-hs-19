
import { MasterController, SelectionController, MasterView, DetailView } from './person.js';

const masterController    = MasterController();
const selectionController = SelectionController();

// create the sub-views, incl. binding

MasterView(masterController, selectionController, document.getElementById('masterContainer'));
DetailView(selectionController, document.getElementById('detailContainer'));

// binding of the main view

document.getElementById('plus').onclick    = _ => masterController.addPerson();
