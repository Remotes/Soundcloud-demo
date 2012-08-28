define(["Backbone","underscore","remoats"], function(Backbone, _){


	var RemoteControl = function(){

		var remoatsClient = new Remoats("1234567890",{
			onEvent : _.bind(function(d) { 
				if(d.data === "oats.client.registered"){
				   this.trigger("ready");
				}
			},this),

			onSwipeLeft : _.bind(function() { 
				this.trigger("prev");
			}, this),

			onSwipeRight : _.bind(function(){ 
				this.trigger("next");
			}, this),

			onTap : _.bind(function() { 
				this.trigger("toggle");
			}, this)   
		});
	}


	_.extend(RemoteControl.prototype, Backbone.Events, {

	});


	return RemoteControl;
});