define([
	"dojo/_base/Deferred", 
	"dojo/_base/xhr"
	],function(Deferred, Xhr){
		return {
			load : function(name, count){
				var deferred = new Deferred();
				Xhr.get({
					url: "/?name="+name+"&count="+count,
					load: function(result) {
						try{
							var tweetList = JSON.parse(result);
							deferred.resolve(tweetList);
						} catch(e){
							deferred.reject(e);
						}
					},
					error : function(e){
						deferred.reject(e);		
					}
				});
				return deferred.promise;
			},
			clearChildren: function(node){
				while (node.firstChild) {
					node.removeChild(node.firstChild);
				}
			}
		}
	});