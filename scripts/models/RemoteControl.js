define(["Backbone","underscore","remoats"], function(Backbone, _){


	var RemoteControl = function(){

		var remoatsClient = new Remoats("1234567890").
			on("Ready", function(){ this.trigger("ready"); } ,this).
			on("swipe-left", function(){ this.trigger("prev"); }, this).
			on("swipe-right", function(){ this.trigger("next"); }, this).
			on("tap", function(){ this.trigger("toggle"); }, this);
	}


	_.extend(RemoteControl.prototype, Backbone.Events, {

	});


	return RemoteControl;
});