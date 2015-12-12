define([
	"dojo/_base/declare",
	"twitterClient/model/HashTag",
	"twitterClient/Utilities",
	"dojo/topic"
	], function (declare, HashTag, Utilities, dojoTopic) {
		return declare( [],{
			constructor: function(){
				this.hashTagList = [];
				dojoTopic.subscribe("/app/dataFetched", this.handleData.bind(this));
				this.allCheckBox = new HashTag({
					name : 'All',
					checked : true,
					count : ''
				});	
			},
			addHashTag : function(hashTag){
				if( ! this.hashTagExists(hashTag)) {
					var details = {
						'name':hashTag.trim(), 
						'checked' : false,
						'count' : 1
					};
					var hashTag = new HashTag(details);
					details.hashTag = hashTag;
					this.hashTagList.unshift(details);
					hashTag.placeAt(this.domNode);
				} else {
					var index = _.pluck(this.hashTagList, "name").indexOf(hashtag);
					this.hashTagList[index].count ++;
				}
			},
			setDomNode : function(domNode){
				this.domNode = domNode;
				this.allCheckBox.placeAt(this.domNode);
			},
			hashTagExists : function(hashTag){
				return _.pluck(this .hashTagList,'name').indexOf(hashTag) !== -1;
			},
			getActiveHashTags : function(){	
				return _.filter(this.hashTagList, function(hashTagElement){
					return hashTagElement.hashTag.checkbox.checked;
				});
			},
			handleData : function(tweetList){
				var self = this;
				_.each(tweetList, function(tweet){
					_.each(tweet.entities.hashtags, function(hashTag){
						this.addHashTag(hashTag.text);
					}, self);
				});	
			},
			handleClick : function(e){
				var list = this.domNode.getElementsByTagName("input");
				if(e && e.srcElement === this.allCheckBox.checkbox){
					this.checkAllboxes(this.allCheckBox.checkbox.checked, list);	
				} else {
					this.updateAllCheckbox(list);
				}
			},
			updateAllCheckbox : function(list){
				for(var i = 1;i<list.length ; i++){
					if(	! list[i].checked){
						this.allCheckBox.checkbox.checked = false;
						return;	
					}
				}
				this.allCheckBox.checkbox.checked = true;
			},
			checkAllboxes : function(allCheckBoxIsChecked, list){
				if(allCheckBoxIsChecked){
					_.each(list, function(checkbox){
						checkbox.checked = true;
					})
				}
			},
			//also writes to the DOM underneath
			updateHashTagCount : function(activeTweetList){
				var self = this;
				var hashTagCount = {};
				_.each(activeTweetList, function(tweet){
					_.each(tweet.tweet.entities.hashtags, function(hashTag){
						hashTagCount[hashTag.text] = hashTagCount[hashTag.text] || 0;
						hashTagCount[hashTag.text]++;
					}, self);
				});
				//hashtagElement looks for the count with its own name in hashTagCount and then writes to its element underneath
				_.each(this.hashTagList, function(hashTagElement){
					hashTagElement.count = hashTagCount[hashTagElement.name] || 0;
					hashTagElement.hashTag.count.innerText = hashTagElement.count;
				});
			}
		});
});