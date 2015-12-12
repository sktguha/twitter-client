define([ 
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"twitterClient/UserNameManager", 
	"twitterClient/TweetManager", 
	"twitterClient/HashTagManager",
	"twitterClient/Utilities", 
	"dojo/topic",
	"dojo/on",
	"twitterClient/widgets/Loader",
	"dojo/text!./templates/app.html", 
	"dojo/domReady!"
	], function(declare, WidgetBase, TemplatedMixin, UserNameManager, TweetManager, HashTagManager, Utilities, dojoTopic, dojoOn, LoaderWidget, template) { 
		
		return declare("twitterClient.App",[WidgetBase, TemplatedMixin], {
			templateString : template,
			constructor : function(){
				this.loader = new LoaderWidget();
				this.userNameManager = new UserNameManager();
				this.hashTagManager = new HashTagManager();
				this.tweetManager = new TweetManager();
			},
			postCreate : function(){
				this.tweetManager.setDomNode(this.result);
				this.userNameManager.setDomNode(this.userList);
				this.hashTagManager.setDomNode(this.hashTagList);
				this.setupDOMListeners();
				this.loader.placeAt(this.loaderContainer);
			},
			setupDOMListeners : function(){
				dojoOn(this.form, "submit", this.handleForm.bind(this));
				dojoOn(this.hashTagList, "click", this.handleClick.bind(this));
				dojoOn(this.userList, "click", this.handleClick.bind(this));
			},
			handleForm : function(e){
				e.preventDefault();
				var name = this.name.value;
				var count = this.count.value;
				var self = this;
				if( ! this.userNameManager.userExists(name) ){
					this.loader.addLoader();
					Utilities.load(name, count).then(function(results){
						self.handleData.apply(self, [results]); 
					}, function(e){
						self.loader.removeLoader();
						alert("error occured "+e.toString());
					});	 
				}
			},
			handleData : function(tweetList){
				this.loader.removeLoader();
				dojoTopic.publish("/app/dataFetched", tweetList, this.getData.bind(this));
			},
			handleClick : function(e){
				this.hashTagManager.handleClick(e);
				var data = this.getData();
				this.tweetManager.handleClick(data.allowedUserArray, data.allowedHashTagList, data.allCheckBoxStatus);
			},
			getData : function(){
				return  {
					allowedUserArray : this.userNameManager.getActiveUsers(),
					allowedHashTagList : this.hashTagManager.getActiveHashTags(),
					allCheckBoxStatus :this.hashTagManager.allCheckBox.checkbox.checked
				}
			}
		});
});