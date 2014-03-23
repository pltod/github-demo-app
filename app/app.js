/**
 * The main application container. 
 * It is kind of a context in which all the modules are created and ran.
 * It plays a role of Mediator between the modules.
 */
define(["layoutManager", "templates"], function() {
	
	"use strict";
	
	var app = {
			//General error message when the API service is unavailable
			errorMessage : "Communication error with the service API!",
			
			//Style for blocking the UI on synchronous calls for data loading
			blockUIStyle : {
				border : 'none',
				padding : '15px',
				backgroundColor : '#000',
				'-webkit-border-radius' : '10px',
				'-moz-border-radius' : '10px',
				opacity : ".5",
				color : '#fff'
			},
			
			//The name of the layout template
			layoutMain : "layoutMain",
			
			//Communication events used in the application for loose coupling between the modules
			customEvents : {
				membersRequested : "MEMBERS_REQUESTED",
				repositoriesRequested : "REPOSITORIES_REQUESTED"
			},
			
			//IDs of html elements that is used as placeholders where html will be inserted
			placeholders : {
				headerPlaceholder : "#header-placeholder",
				footerPlaceholder : "#footer-placeholder",
				contentPlaceholder : "#content-placeholder"
			},
			
			cache : {
				twitterMembers : null
			}
		}, 
		//Global variable - kind of a namespace for the compiled templates 
		JST = window.JST = window.JST || {}, 
		
		//The following four variables are needed for Backbone Layoutmanager configuration 
		appRoot = "/", 
	
		layoutPath = "app/templates/", 
		
		templatePath = "app/templates/", 
		
		templateExtension = ".html",
	
		//CODE REUSE: View class extension. Helps us not write serialize method on every new Model View
		BaseModelView = Backbone.View.extend({
			serialize : function() {
				return this.model.toJSON();
			}
		}),
	
		//CODE REUSE: View class extension used for Collection Views. Code reuse for initialize and beforeRender methods. 
		BaseCollectionView = Backbone.View.extend({
			initialize : function(options) {
				this.listenTo(this.collection, 'add', function(s) {
					this.render();
				});
			},
			beforeRender : function(manage) {
				this.collection.each(function(item) {
					this.insertView(new this.child({
						model : item
					}));
				}, this);
			}
		});


	//Configuration for Backbone Layoutmanager
	Backbone.Layout.configure({

		manage : true,

		prefix : templatePath,

		fetch : function(path) {
			var done;

			path = path + templateExtension;

			//The code in this conditional will never be executed since the application is working with precompiled
			//templates to avoid Access-Control-Allow-Origin problem
			if(!JST[path]) {
				//The idea here is to allow the callback to decide at runtime whether the loop will be synchronous or asynchronous
				done = this.async();
				return $.ajax({
					url : appRoot + path
				}).then(function(contents) {
					JST[path] = Handlebars.compile(contents);
					done(JST[path]);
				});
			}
			return JST[path];
		}
	});


	//Extend Backbone with the defined functionality
	Backbone.BaseModelView = BaseModelView;
	Backbone.BaseCollectionView = BaseCollectionView;

	// Mix together our Application object with module support, layout manager, and Backbone.Events.
	return _.extend(
			app, 
			{
				/**
				 * This is kind of a Facade to the MVC mechanism used in this application.
				 * In ideal situation instead of passing the whole Backbone object here we can define custom application interface that will rely on the specific mechanism - in our case on Backbone.js.
				 * Having such interface would allow us to replace Backbone without impacting the rest of the application code.
				 */
				MVC : Backbone,
		
				// Used for module creation
				module : function(additionalProps) {
					return _.extend({
						Views : {}
					}, additionalProps);
				},
				
				//Helper method for working with Backbone Layoutmanager as suggested in Backbone Layout documentation		
				useLayout : function(name) {
					if(this.layout && this.layout.options.template === name) {
						return this.layout;
					}
		
					if(this.layout) {
						this.layout.remove();
					}
		
					var layout = new Backbone.Layout({
						template : name,
						className : "layout " + name,
						id : "layout"
					});
		
					$("#main").empty().append(layout.el);
		
					layout.render();
		
					this.layout = layout;
		
					return layout;
				}
			}, 
			//The application could use another mechanism for event management but here we borrows the one implemented in Backbone.
			Backbone.Events);
});
