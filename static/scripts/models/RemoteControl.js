define(["Backbone","underscore","libs/remoats"], function(Backbone, _){


	var RemoteControl = function(){

		var remoatsClient = new Remoats("1234567890",false);

		remoatsClient.onEvent = _.bind(function(d) { 
		if(d.data === "oats.client.registered"){
		   this.trigger("ready");
		 }
		},this);

		remoatsClient.onSwipeLeft = _.bind(function() { 
			this.trigger("prev");
		}, this);

		remoatsClient.onSwipeRight = _.bind(function(){ 
			this.trigger("next");
		}, this);

		remoatsClient.onTap = _.bind(function() { 
			this.trigger("toggle");
		}, this);   

	}


	_.extend(RemoteControl.prototype, Backbone.Events, {

	});


	return RemoteControl;
});