**STATE**

> WORKING BUT NOT SUPPORTED.

> STILL A VALID SINGLE PAGE APPLICATION STRUCTURE FOR JAVASCRIPT WEB APP THAT CONSUMES EXTERNAL API.



**PURPOSE**

> Experimenting with SPA application structure using Backbone, Backbone Layout Manager, Require JS, Grunt, and Twitter Bootstrap.


**HOW TO RUN IT**


The demo is client-side JavaScript self-contained application that consumes external API.
This means that it could be ran in one of the two possible ways:

1. Open index.html in the root folder (Chrome or Firefox only, IE is not tested)
2. Open index.html in the dist folder (Chrome or Firefox only, IE is not tested)

Note that this is possible only if node and bower modules are included in the package and grunt build is executed.
If not the following commands must be runned (node.js, bower, and grunt must be installed to be able to do this):

- npm install (in the root folder)
- bower install (in the root folder)
- grunt (compiles templates and put artifacts into distribution folder)


**FOLLOW UP**

Not published yet but it is the same application with different tech stack.

Backbone.js replaced with Twitter Flight for the View part and custom Data Models for the data part.


# Detailed Information


## Demo Application Scope

- The demo application is consuming Github API 

- It loads 10 members of Twitter Github organization 

- Each member could be clicked to see 20 of its repositories

- For each repository the number of forks and watchers are displayed

Note: Demo application is not using OAuth for authentication when using Github API. So it is limited to 60 requests per hour before being blocked. If this happens we must wait 1 hour in order to have 60 more requests.


## Technology Stack

* Backbone.js  – JavaScript library to achieve Model View Controller paradigm on the client. This is a requirement for this demo application. It is a good choice since it is very lightweight and does not enforce to specific architecture model. It is just gives you convenient classes to code against MVC pattern and to communicate with a service with a REST API

* JQuery – DOM manager on which depends some of the other libraries.

* Underscore.js – JavaScript utilities. Backbone depends on this library as well.

* Backbone Layout Manager – A Layout and template manager for Backbone.js applications. This is chosen because it keeps the flexibility provided by Backbone and helps in layout and template management. Alternatives for the aspects covered by Backbone Layout Manager are Backbone Marionette, Chaplin and some more frameworks on top of Backbone.

* Handlebars.js – templating mechanism 

* Twitter Bootstrap – framework with responsive CSS layouts and some more extras

* Twitter Bower – package manager for managing client side dependencies

* Grunt – The build tools used in the development process

* Require.js – AMD loader to load the javascript code asynchronously

* Almond – This is a subset of Require.js that is used to be put in minified JavaScript to reduce the size of the application

* Block UI – JavaScript plugin for blocking parts of the DOM when necessary


## Development Process

* Grunt and Bower are playing major role in the development process. Twitter Bower is used to manage client side dependencies while Grunt is used for many tasks during the production build of the application. Each task is covered by grunt plug-in. Both Bower and Grunt (and all of its plug-ins) are installed with npm package manager part of node.js environment.

For example to build the production version of the application we just run grunt command inside the root folder. This command does all of the following:

* Clean the distribution directory

* Apply jshint rules on the source code and return if something is not ok

* Compile handlebars templates

* Concatenate all JavaScript files into a single file and minifies

* Includes in it almond as a subset of require js to reduce the size of the distribution

* Minifies the CSS

* Produce the production html that points to the single JavaScript source file and the minified styles

Note that in order to be able to use bower and grunt, node.js must be installed first.

After that:

* Grunt plug-ins could be installed with ‘npm install’ command in the root folder

* Bower components could be installed with ‘bower install’ command in the root folder

Production build is made with ‘grunt’ command in the root folder which produces the dist folder

## Architecture

In this section are described some application specifics and architecture decisions.

The application structure is inspired by Backbone Boilerplate (https://github.com/backbone-boilerplate/backbone-boilerplate) with some modifications made on different aspects.

### Folder Structure


* app – contains the application code

* app/css – contains the styles

* app/modules – Modules with Backbone based Models, Views and Collections that are used for implementing application logic

* app/templates – contains all handlebar templates

* assets – contains clients side dependencies – components installed with Bower and other plugins

* dist – contains all the artifacts as a result of the build. In fact only index.html, index.css, and sources.js are needed from here to run the application.

* node_modules – contains installed by npm grunt plugins used in the development process

### Architecture Aspects

In this section are described several architecture decisions. For more detailed understanding could help the source code and the comments inside is.


* Backbone Router: it is omitted from this application since it is considered not useful when the application must be embedded on a third party site. Then the back button navigation is achieved via the host site. So demo application is designed as single page application (SPA) which could navigate to different parts of application with the help of events triggered on different user actions

* Event Management: it is used the embedded into Backbone.js mechanisms although it could be replaced by another in case of a need

* Asynchronous Module Definition: the code is written in the form of AMD modules that could be loaded in parallel. The dependency between them is managed through Require.js library that is de-facto standard until EcmaScript modules are supported by the browsers

* Responsive design: responsive design is achieved with the help of Twitter Bootstrap library. Currently the application is using version 2.X of the library but migration to version 3.0 would be easy and probably beneficial considering the mobile-first nature of the third version

* Template rendering:  the application is working with Handlebars templates. This gives nice separation between the HTML and the JavaScript code. Usually there are two possibilities – rendering templates on the server or rendering templates on the client. For the purpose of this application templates are rendered during the development process with Grunt. Two are the benefits of this:

> Avoids Access-Control-Allow-Origin problem which happens when loading files via JavaScript file from the local machine

> Reduce the burden of the clients where this application will be embedded in respect to template rendering 

* Data Caching – depending on the use cases data obtained from the third party service could be cached on the client for subsequent use. Backbone also gives some possibilities in optimal re-initialization of its collections. In the Demo application a very simple mechanism for caching is used to store the loaded members and not load them each time when going to member page. Basically it is loaded just once when the application is loaded for the first time. The cached data is stored into JavaScript object. HTML5 Local Storage is not used for this particular case.

* Isolating the third party libraries for easier replacement if necessary – Façade pattern is used to isolate the entry point for different libraries used. This is done through Demo application custom interface. So if it is necessary to replace particular library inside Demo application this will require modification only on a single place.

### Code Quality

Here are some actions done regarding the code quality:

* Naming conventions – some naming convections are used regarding Backbone View classes. Depending on the View purpose its name ends with LV, CV, or MV for Layout Views, Collection Views, or Model Views respectively

* Code Reuse – Several base classes are defined that holds repetitive code across all Model and Collection Views

* Promises – Promise pattern is preferred than Callback pattern to remove the ‘callback hell’. This is well illustrated when loading the repositories.

* JavaScript Practices – JavaScript practices like single var declaration, using ES5 strict mode, and more are used

* JSHint – during the build process a grunt-jshint plugin is used to check the code quality in respect to different practices

* Style Guide – For the Demo a formal style guide apart from jshint rules are not applied. But idiomatic JavaScript style guide (https://github.com/rwaldron/idiomatic.js/) is considered a good option to be applied in the future

### Testing

There are no tests implemented in the Demo application.

However, possible approaches are:

* using Karma as a test runner: http://karma-runner.github.io/0.10/index.html 

* using Karma Mocha plug-in Mocha test framework: http://visionmedia.github.io/mocha/ 

* using Chai.js as assertion library: http://chaijs.com/   

### Browser Support

Application is working in Chrome and Firefox browsers.

This version is not tested inside Internet Explorer.

However it most probably works in the IE >= 9 and it could work in earlier IE versions with appropriate shims.
