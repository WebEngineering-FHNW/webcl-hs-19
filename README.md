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

## week 7
- A custom gauge object drawn on a canvas with JS binding mouse and touch interactions
- Redrawing the sketch on changes to avoid pixelation
- Canvas needs to use cursor position to determine values
- Animated SVG-Image of eyes following the mouse pointer
[Gauge View](https://webengineering-fhnw.github.io/webcl-hs-19/week7/canvas-gauge-sketch/View.html),
[SVG Eyes View](https://webengineering-fhnw.github.io/webcl-hs-19/week7/svg-eyes-sketch/Eyes.html)

## week 8
- Drag&Drop enabled [sketch](https://webengineering-fhnw.github.io/webcl-hs-19/week8/pep-sketch/PEP.html) for the staff and project planning tool 
- Mathematically based SVG animation to fill a bucket
[Personnel planning](https://webengineering-fhnw.github.io/webcl-hs-19/week8/pep-sketch/PEP.html),
[Bucket SVG](https://webengineering-fhnw.github.io/webcl-hs-19/week8/svg-bucket-sketch/BucketWAF.html)

## week 9
- Custom square element with programmable color, size and onclick-action and how it is used in html
[Custom element](https://webengineering-fhnw.github.io/webcl-hs-19/week9/custom-elements/CustomElement.html)

## week 10
Student submissions:
- [Angular Bucket](https://github.com/Chiirali/angular-bucket)
- [Svelte SVG](https://github.com/gobeli/webcl-svg)
- [React Eye SVG](https://github.com/knnhcn/react-eye-svg)
- [React Gauge](https://github.com/peerjuettner/react-gauge)
- [Vue PigEyes](https://codesandbox.io/s/vue-template-4ehxh)

## week 11
- Grails Backendserver for the pep personnel planning tool with example client (https://github.com/WebEngineering-FHNW/webcl-hs19-server)
- Pep client app uses fetch api to connect to backend (https://github.com/WebEngineering-FHNW/webcl-hs19-server/tree/restify)

## week 12
=> Week 6 Person View observable updated with listener limit to resolve memory leak
[Person View](https://webengineering-fhnw.github.io/webcl-hs-19/week6/person/View.html), 
[Tests](https://webengineering-fhnw.github.io/webcl-hs-19/week6/allTestsAsync.html)

## week 13
- [Server Push Alternatives](https://github.com/gobeli/webcl-server-push)
- [CSS media selector, simple timeline](https://gitlab.imbiscuso.ch/Mischa/css-tricks-webcl)
- Stable bindings with view specific presentation models instead of listener limit
- ModelWorld with qualifiers to synchronize the attribute values
[Person View](https://webengineering-fhnw.github.io/webcl-hs-19/week13/person/View.html), 
[Tests](https://webengineering-fhnw.github.io/webcl-hs-19/week13/allTestsAsync.html)

## week 14
- Stable binding in PEP client with view-specific Presentation Models
- Assignment-views of developers in projects are kept in sync as defined by the ModelWorld rule #1
[Pep client](https://webengineering-fhnw.github.io/webcl-hs-19/week14/pep/pep.html)

## week 15
- [CSS alternative](https://github.com/InnigerM/webcl-hs-19/blob/master/week14/pep/pepStyle.css)
- Finishing the collaboration story
- [Pep client](https://webengineering-fhnw.github.io/webcl-hs-19/week14/pep/pep.html)
- [Alternative Pep client](https://webengineering-fhnw.github.io/webcl-hs-19/week14/pep/pep2.html)

