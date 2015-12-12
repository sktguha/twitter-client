define([
	"dojo/_base/declare",
	"twitterClient/model/Tweet",
	"twitterClient/Utilities",
	"dojo/topic"
	], 
	function(declare, Tweet, Utilities, dojoTopic) {
		
		return declare( [],{
			constructor : function() {
				this.tweetList = [];
				dojoTopic.subscribe("/app/dataFetched", this.handleData.bind(this));
			},
			setDomNode : function(domNode) {
				this.domNode = domNode;
			},
			addTweets : function(list, allowedUserArray, allowedHashTagList, allCheckBoxStatus) {
				list = _.map(list, function(t) {
					var tweetElement = {
						'tweet': new Tweet(t),
						'details': t
					};
					tweetElement.tweet.display = this._isTweetDisplayable(tweetElement,allowedUserArray, allowedHashTagList, allCheckBoxStatus);
					return tweetElement;
				}, this);
				this.tweetList = this.tweetList.concat(list);
				return this.tweetList;
			},
			handleData : function(list, callback) {
				var data = callback(),
					allowedUserArray = data.allowedUserArray,
					allowedHashTagList = data.allowedHashTagList,
					allCheckBoxStatus = data.allCheckBoxStatus;

				this.addTweets(list, allowedUserArray, allowedHashTagList, allCheckBoxStatus);
				this.updateDom();
			},
			handleClick : function(activeUsers, activeHashTags, allCheckBoxStatus){
				this.updateTweets(activeUsers, activeHashTags, allCheckBoxStatus);
				this.updateDom();
			},
			updateTweets : function(allowedUserArray, allowedHashTagList, allCheckBoxStatus){
				_.each(this.tweetList, function(tweetElement) {
					tweetElement.tweet.display = this._isTweetDisplayable(tweetElement, allowedUserArray, allowedHashTagList, allCheckBoxStatus)
					tweetElement.tweet.updateDisplay();
				}, this);
			},
			_isTweetDisplayable : function(tweetElement, allowedUserArray, allowedHashTagList, allCheckBoxStatus){
				var screenName = tweetElement.tweet.getScreenName();
				var userExists = allowedUserArray.indexOf(screenName) !== -1 ;
				if(!userExists) {
					return false;
				}

				var screenName = tweetElement.tweet.getScreenName(),
				 	hashTags = tweetElement.tweet.getHashTags();
				 	hashTagExists = _.some(allowedHashTagList, function(el){
						return tweetElement.tweet.containsHashTag(el.name);
					});

				return allCheckBoxStatus || hashTagExists;
			},
			getCurrentList : function() {
				return this.tweetList;
			},
			sortTweets : function() {
				this.tweetList = this.tweetList.sort(function(t1, t2) {
					return +new Date(t1.tweet.getCreatedAt()) - +new Date(t2.tweet.getCreatedAt());
				});
			},
			updateDom : function() {
				this.sortTweets();
				Utilities.clearChildren(this.domNode);
				_.each(this.tweetList, function(t){
					t.tweet.placeAt(this.domNode);
					t.tweet.updateDisplay();
				}, this);
			}
		});
});