/**
 * Require JS configuration file
 */
require.config({

	deps : ["main"],
	paths : {
		/* base libraries */
		underscore : "../assets/components/underscore/underscore",
		jquery : "../assets/components/jquery/jquery",

		/* client side MVC and layout management */
		backbone : "../assets/components/backbone/backbone",
		layoutManager : "../assets/components/layoutmanager/backbone.layoutmanager",

		/* templating with precompiled templates */
		handlebars : "../assets/components/handlebars.js/dist/handlebars",
		templates : "../dist/precompiledTemplates",

		/* library and plugins for better UI/UX */
		bootstrap : "../assets/components/bootstrap/docs/assets/js/bootstrap",
		blockUI : "../assets/plugins/jqueryBlockUI"
	},

	/* descriptor that allows Require JS to load non-AMD compatible scripts */
	shim : {
		underscore : {
			exports : '_'
		},
		backbone : {
			deps : ["underscore", "jquery"],
			exports : "Backbone"
		},
		layoutManager : {
			deps : ["backbone"]
		},
		bootstrap : {
			deps : ["jquery"]
		},
		blockUI : {
			deps : ["jquery"]
		},
		templates : {
			deps : ["handlebars"]
		}

	}

});
