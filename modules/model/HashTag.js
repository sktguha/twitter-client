define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!../templates/hashTag.html"
    ],function(declare, WidgetBase, TemplatedMixin, template) {
        
        return declare([WidgetBase, TemplatedMixin],{
            templateString : template,
            constructor : function(hashtagDetails){
                this.userName = hashtagDetails.name;
                this.checked = hashtagDetails.checked;
                this.hashTagCount = hashtagDetails.count;
            },
            postCreate : function(){
                this.name.innerText = this.userName;
                this.checkbox.checked = this.checked;
                this.count.innerText = this.hashTagCount;
            }
        });
    });