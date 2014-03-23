/**
 * The application bootstrapper.
 * It loads the application container and all the needed modules.
 */
require(["app", "modules/layout", "modules/member", "modules/repository"], 
	
	function(App, Layout, Member, Repository) {
	
	"use strict";
	
	//Handlers for specific events
	App.on(App.customEvents.membersRequested, function() {
		Member.load();
	});

	App.on(App.customEvents.repositoriesRequested, function(member) {

		//PATTERN USED: Asynchronous code with Promises instead of callbacks - to avoid the 'callback hell' 
		//the loadFor method is implemented with the help of jQuery deffered functionality 
		var promiseToLoadRepositories = Repository.loadFor(member);


		//This is the code that will be executed afte the repositories are loaded
		promiseToLoadRepositories.done(function(repositoriesView) {
			var views = {};
			views[App.placeholders.contentPlaceholder] = new Layout.Views.RepositoriesLV({
				ownerView : new Member.Views.MemberDivMV({
					model : member
				}),
				repositoriesView : repositoriesView
			});
			App.useLayout(App.layoutMain).setViews(views).render();
		});

		//In case of failed promise we are handling the error
		promiseToLoadRepositories.fail(function() {
			alert(App.errorMessage);
		});
	});

	//Draws the static layout
	Layout.draw();

	//Loads dynamic content
	Member.load();

	/**
	 * SPA application. All the clicks are processed in this handler.
	 * Currently it just prevents the page refresh when click on anchor elements.
	 * Links with 'data-bypass' attribute are not handled here and have a normal behavior.
	 *
	 */
	$(document).on("click", "a:not([data-bypass])", function(evt) {
		
		// Stop the default event to ensure the link will not cause a page refresh.
		evt.preventDefault();

	});
});
