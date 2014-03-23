/**
 * Defines Views with static data used for shaping the application layout.
 */
define(["app", "bootstrap"], function(App) {
	
	"use strict";
	
	var Layout = App.module(
		{
			draw: function() {
				var views = {};
				views[App.placeholders.headerPlaceholder] = new Layout.Views.HeaderLV();
				views[App.placeholders.footerPlaceholder] = new Layout.Views.FooterLV();
				App.useLayout(App.layoutMain).setViews(views).render();
			}
		}
	);

	/**
	 * View for application header.
	 */
	Layout.Views.HeaderLV = App.MVC.View.extend({
		template : "layoutHeader",
		events : {
			"click brand" : "loadMembers"
		},
		loadMembers : function() {
			App.trigger(App.customEvents.membersRequested);
		},
		afterRender : function() {
			$(".brand").tooltip();
		}
	});

	/**
	 * View for application footer
	 */
	Layout.Views.FooterLV = App.MVC.View.extend({
		template : "layoutFooter",
		tagName : "footer"
	});

	/**
	 * Compound layout view that combines displaying of information from two different modules - Member and Repository. 
	 */	
	Layout.Views.RepositoriesLV = App.MVC.View.extend({
		template : "layoutRepositories",
		initialize : function(options) {
			this.setView("#owner", options.ownerView);
			this.setView("#repositories", options.repositoriesView);
		}
	});

	
	return Layout;
});
