define(["Backbone", "models/Track", "soundcloud"],function(Backbone, Track, SC){

	var SCCollection = Backbone.Collection.extend({
		sync : function(method, model, options){ 
	      	
	      	if(typeof SC === 'undefined') {
	      		throw new Error("Soundcloud is not initialized properly");
	      	}

	        if(method === "read"){
	    		var dfd = new $.Deferred();
	    		
	    		SC.get(this.url, _.bind(function(r){
	    			
	          		if(typeof options.success !== 'undefined'){
			          	options.success(r);
			        }

	              	dfd.resolve(this);
	            },this));
	    
	    		return dfd.promise();
	        } else {
	          	throw new Error("Operation not supported");
	        }
      	}
	});


	var Favorites = SCCollection.extend({
		model : Track,
		url : "/users/1539950/favorites"
	});


	return { 
		get : function(){
			var favorites = new Favorites();
			return favorites.fetch();
		}
	};

});