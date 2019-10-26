# webcl-hs-19
Web Clients HS 19

## week 1
Note that todo items are not yet created:
[Todo View](https://webengineering-fhnw.github.io/webcl-hs-19/week1/todo/View.html)

## week 2
- Todos are converted to uppercase
- Validation error (text red) occurs if todo text is shorter than three letters
[Todo View](https://webengineering-fhnw.github.io/webcl-hs-19/week2/todo/View.html), 
[Tests](https://webengineering-fhnw.github.io/webcl-hs-19/week2/allTestsAsync.html)

## week 3
- Controller contains businesslogic (Todos are editable only until done)
- The properties of attributes (like editable) are themselves observables
- Projectors create the views and register listeners for both directions
[Todo View](https://webengineering-fhnw.github.io/webcl-hs-19/week3/todo/View.html), 
[Tests](https://webengineering-fhnw.github.io/webcl-hs-19/week3/allTestsAsync.html)

## week 4
- Contains new application to manage persons in a master-/detailview
- Specific person projectors and rich attributes prepared to be completed
[Todo View](https://webengineering-fhnw.github.io/webcl-hs-19/week4/todo/View.html), 
[Person View](https://webengineering-fhnw.github.io/webcl-hs-19/week4/person/View.html), 
[Tests](https://webengineering-fhnw.github.io/webcl-hs-19/week4/allTestsAsync.html)

## week 5
- Generalised projectors which can create the gui elements list and form
- The projectors take a model and a list of attributes to display
- Projectors can be reused for any model, automatically creating rich attributes, bindings, etc.
[Person View](https://webengineering-fhnw.github.io/webcl-hs-19/week5/person/View.html), 
[Tests](https://webengineering-fhnw.github.io/webcl-hs-19/week5/allTestsAsync.html)

## week 6
- CSS-in-JS: The Projector now also provides a css style for the defined classnames which when used has precedence over external css definitions
- Dynamically added grid column for each passed attribute
- More independence by checking whether there is a child to replace or the div should just be added
- A focus animation on the inputfields in the style of material design
[Person View](https://webengineering-fhnw.github.io/webcl-hs-19/week6/person/View.html), 
[Tests](https://webengineering-fhnw.github.io/webcl-hs-19/week6/allTestsAsync.html)
