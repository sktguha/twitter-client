define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!../templates/user.html"
	],function(declare, WidgetBase, TemplatedMixin, template) {
		
		return declare([WidgetBase, TemplatedMixin],{
			templateString : template,
			constructor : function(userDetails){
				this.userName = userDetails.name;
				this.checked = userDetails.checked;
			},
			postCreate : function(){
				this.name.innerText = this.userName;
				this.checkbox.checked = this.checked;
			}
		});
	});