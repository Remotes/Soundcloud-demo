define(["Backbone", "soundcloud"],function(Backbone, SC){


	var Track = Backbone.Model.extend({
		getSound : function(){		
			var dfd = new $.Deferred();
			SC.stream("/tracks/" + this.get("id"), function(sound){
			  	dfd.resolve(sound);
			});
			return dfd.promise();
		}
	});

	return Track;

});