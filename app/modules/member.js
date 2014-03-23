/**
 * Member module. It defines the Member model and its related views.
 */
define(["app", "blockUI"], function(App) {
	
	//PATTERN USED: ES5 strict mode is recommended to avoid errors
	"use strict";

	var Member = App.module({
		
		load: function() {
			
			//PATTERN USED: Declarations are on top of the function because according to the EcmaScript standard they are hoisted anyway
			var members,
				views = {};
			
			//Block the screen until loading of data is done
			$.blockUI({
				message : 'Loading Twitter Organization Members...',
				css : App.blockUIStyle
			});

			if (App.cache.twitterMembers === null) {
				members = new Member.Collection();
				
				//Invoking the fetch method of Backbone collection instructs Backbone 
				//to make HTTP request for loading the data from the service API.
				members.fetch({
					
					//Render appropriate layout with the fetched data 
					success : function(collection) { 
						views[App.placeholders.contentPlaceholder] = new Member.Views.MemberListCV({
							collection : collection
						});
						
						//Store the twitter member collection into application cache
						App.cache.twitterMembers = collection; 
						
						App.useLayout(App.layoutMain).setViews(views).render();
						$.unblockUI();
					},
					
					//Handle the error in case data is not being able to be loaded
					error : function() {
						$.unblockUI({
							onUnblock : function() { alert(App.errorMessage);
							}
						});
					}
				});
			} else {
				//Use the cached twitter member collection
				views[App.placeholders.contentPlaceholder] = new Member.Views.MemberListCV({
					collection : App.cache.twitterMembers
				});
				App.useLayout(App.layoutMain).setViews(views).render();
				$.unblockUI();
			}
				
		}	
	});

	Member.Model = App.MVC.Model.extend({
		defaults : {
			login : "Member User Name",
			avatar_url: "Avatar",
			html_url: "Github Account URL"
		},
		initialize : function() {
			//This helps Backbone to know which models are new on fetching and does not trigger add event for them.
			//So Backbone can do intelligently merge of the fetched models
			//However it still relies on the server API to return the same id for the same models each time 
			//this.cid = this.get("item_id");
			this.cid = this.get("login");
		}
	});

	Member.Collection = App.MVC.Collection.extend({
		model : Member.Model,

		url : function() {
			return "https://api.github.com/orgs/twitter/members?callback=?";
		},
		parse : function(data) {
			if (data!==undefined && data !== null) {
				if (data.data !== undefined && data.data !== null) {
					return data.data.slice(0, 10);
				} 
			}
			
			//TODO error case must be handled
		}
	});
	
	//Member displayed as a list item
	Member.Views.MemberListItemMV = App.MVC.BaseModelView.extend({
		
		template : "member",
		className : "alert alert-info span7 item",
		tagName : "li",
		
		events : {
			"click .btn" : "loadRepositories"
		},
		loadRepositories : function() {
			App.trigger(App.customEvents.repositoriesRequested, this.model);
		}
	});

	//Member displayed inside a div
	Member.Views.MemberDivMV = App.MVC.BaseModelView.extend({
		
		template : "owner",
		className : "alert alert-warning span8 offset1 shadow",
		
		events : {
			"click .btn" : "loadMembers"
		},
		loadMembers : function() {
			App.trigger(App.customEvents.membersRequested);
		}
	});

	//Member collection displayed as unordered list
	Member.Views.MemberListCV = App.MVC.BaseCollectionView.extend({
		
		className : "span8 offset1 padded shadow",
		tagName : "ul",
		child: Member.Views.MemberListItemMV
		
	});
	

	return Member;
});
