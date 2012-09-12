define(["jquery","Backbone","underscore","handlebars", "text!templates/track.html"],
	function($,Backbone,_,Handlebars, template){

		var Track = Backbone.View.extend({
			template : Handlebars.compile(template),
			tagName : "a",

			render : function(){
				$(this.el).html(this.template(this.model.toJSON()));
				return this.el;
			}
		});

		return Track;
});