define([
	"dojo/_base/declare",
	"twitterClient/model/User",
	"twitterClient/Utilities",
	"dojo/topic"
	], function (declare, User, Utilities, dojoTopic) {
		return declare( [],{
			constructor: function(){
				this.userList = [];
				dojoTopic.subscribe("/app/dataFetched", this.handleData.bind(this));
			},
			addUser : function(userName){
				if( ! this.userExists(userName.trim())) {
					var details = {
						'name':userName.trim(), 
						'checked': true
					};
					var user = new User(details);
					details.user = user;
					this.userList.unshift(details);
					user.placeAt(this.domNode);
				} 
			},
			setDomNode : function(domNode){
				this.domNode = domNode;
			},
			userExists : function(userName){
				return _.pluck(this.userList,'name').indexOf(userName) !== -1;
			},
			handleData : function(tweetList){
				this.addUser(tweetList[0].user.screen_name);
			},
			getActiveUsers : function(){	
				return _.chain(this.userList).filter(function(u){
					return u.user.checkbox.checked;
				}).pluck('name').value();
			}
		});
});