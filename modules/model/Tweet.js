define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!../templates/tweet.html"
    ],function(declare, WidgetBase, TemplatedMixin, template) {

        return declare([WidgetBase, TemplatedMixin],{
            templateString : template,
            constructor: function(details){
                this.details = details;
            },
            postCreate : function(){
                this.createdAt.innerText = this.details.created_at;
                this.screenName.innerText = this.details.user.screen_name;
                this.userName.innerText = this.details.user.name;
                this.text.innerText = this.details.text;
            },
            updateDisplay : function(){
                this.mainDiv.style.display = this.display?'block':'none';
            },
            containsHashTag: function(hashTag){
                var hashTagList = this.details.entities.hashtags;
                return _.some(hashTagList, function(el){
                    return (el.text === hashTag);
                });
            },
            getScreenName : function(){
                return this.details.user.screen_name;
            },
            getHashTags : function(){
                return this.details.entities.hashtags;
            },
            getCreatedAt : function(){
                return this.details.created_at;
            }
        });
    });
