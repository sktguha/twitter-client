define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!../templates/loader.html"
    ],function(declare, WidgetBase, TemplatedMixin, Template) {
        
        return declare([WidgetBase, TemplatedMixin],{
            templateString : Template,
            addLoader : function(){
                this.loaderContainer.style.display = 'block';
            },
            removeLoader : function(){
             this.loaderContainer.style.display = 'none';  
         }
     });
    });