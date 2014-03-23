/**
 * Repository module. It defines the Repository model and its related views.
 */
define(["app"], function(App) {
	
	"use strict";

	var Repository = App.module({
		
		/**
		 * Loads repositories for requested member. This function return Promise.
		 * After its resolution particular application logic will be executed.  
		 */
		loadFor: function(member) {
			
			//PATTERN USED: Single var declaration
			var memberId = member.get("login"),
				promiseToLoadRepositories = $.Deferred(),
				repositories = new Repository.Collection({
					memberId : memberId
				});
			
			//Blocks the screen until the repositories are loaded
			$.blockUI({
				message : 'Loading repositories...',
				css : App.blockUIStyle
			});
			
			//Fetch data from the service API
			repositories.fetch({
				
				//Resolve the promise after loading has completed
				success : function(collection) {
					$.unblockUI();
					promiseToLoadRepositories.resolve( new Repository.Views.RepositoryListCV( { collection : collection } ) );
				},
				
				//Reject the promise on error
				error : function() {
					$.unblockUI();
					promiseToLoadRepositories.reject();
				}
			});
			
			return promiseToLoadRepositories;
		}
		
	});

	Repository.Model = App.MVC.Model.extend({
		defaults : {
			name: "Repository Name",
			description: "Repository Description",
			forks: "Forks Count",
			watchers_count: "Watchers Count"
		}
	});

	Repository.Collection = App.MVC.Collection.extend({
		model : Repository.Model,
		initialize : function(options) {
			if(options !== undefined && options !== null) {
				this.memberId = options.memberId;
			}
		},
		url : function() {
			return "https://api.github.com/users/" + this.memberId + "/repos";
		},
		parse : function(data) {
			if (data!==undefined && data !== null) {
				if (data.length > 20) {
					return data.slice(0, 20);
				} else {
					return data;
				}
			}
			
			//TODO handle the case when something is wrong with the data
		}
	});
	
	//Repository displayed as a list item
	Repository.Views.RepositoryListItemMV = App.MVC.BaseModelView.extend({
		template : "repository",
		tagName : "li",
		className : "alert alert-info span7 item"
	});

	//Repository collection displayed as unordered list
	Repository.Views.RepositoryListCV = App.MVC.BaseCollectionView.extend({
		className : "span8 offset1 padded shadow",
		tagName : "ul",
		child: Repository.Views.RepositoryListItemMV
	});

	

	return Repository;
});
