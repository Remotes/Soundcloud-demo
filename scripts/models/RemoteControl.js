define(["Backbone","underscore","remotes"], function(Backbone, _){


	var RemoteControl = function(){

		var remoatsClient = new Remotes("preview").
			on("Ready", function(){ this.trigger("ready"); } ,this).
			on("swipe-left", function(){ this.trigger("next"); }, this).
			on("swipe-right", function(){ this.trigger("prev"); }, this).
			on("tap", function(){ this.trigger("toggle"); }, this);
	}


	_.extend(RemoteControl.prototype, Backbone.Events, {

	});


	return RemoteControl;
});