(function($,ns) {
	
	var AppRouter = Backbone.Router.extend({

		routes: {
			"home"			: "onHome",
			"oauth"    	 	: "onOauthCallback",
			"pi/:pid"	 	: "onPiHome",
			"user/:id" 		: "onUserHome",
			"*actions"  	: "defaultRoute"
		},

		defaultRoute: function( actions ) {
			var currUsername = StackMob.getLoggedInUser();
			if (currUsername) {
				var user = new StackMob.User({username: currUsername});
				user.fetch({
					success: function() {
						ns.appRouter.navigate("user/"+user.get("netflix_id"),{trigger: true});
					}
				});
				return;
			}
			ns.appRouter.navigate("home",{trigger: true});
		},

		onHome: function() {
			this.showPage("#home");
		},

		onOauthCallback: function( actions ) {
			// user should be logged in at this point.
			if (!StackMob.getLoggedInUser()) {
				ns.appRouter.navigate("",{trigger: true});
				return;
			}
			this.showPage("#oauth");
			var bar = $("#oauth .progress .bar"),
				search = location.search;

			if (search && search[0]=='?') {
				var oauth_token = _.find(search.substring(1).split("&"),
									function(q){return q.indexOf("oauth_token")!=-1});
				if (oauth_token) {
					oauth_token = encodeURIComponent(oauth_token.split("=")[1]);
					bar.animate({width: "90%"},1000);
					//_.delay(function() {
						StackMob.customcode('oauth_token',{token: oauth_token},{
							success: function(result) {
								bar.stop(true,true).width("100%");
								window.location = "/#user/"+result.userId;
							}
						});
					//}, 1000);
				}
			}
		},

		onUserHome: function( userId ) {
			if (!userId || !StackMob.getLoggedInUser()) {
				ns.appRouter.navigate("",{trigger: true});
				return;
			}

			this.showPage("#user_home");
		},

		showPage: function(pageSel) {
			$("body > .page").addClass('hidden');
			$(pageSel).removeClass('hidden');
		}

	});

	$(function() {
		StackMob.init({
			appName: "streampi",
			clientSubdomain: "victordoss",
			publicKey: "f82a0708-f69b-49b5-8201-1b0d7003ebf6",
			apiVersion: 0
		});
		ns.objs = {views:{},models:{}};
		ns.appRouter = new AppRouter();
		Backbone.history.start();
	});

})(jQuery, FLIXBUD.namespace('main'));

