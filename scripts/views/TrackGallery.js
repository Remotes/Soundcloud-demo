define([


	"jquery","Backbone", "handlebars", 
	"views/Track",
	"text!templates/gallery.html", 
	"libs/backbone.tyler","libs/jquery.gallery"

	], function($,Backbone,Handlebars,TrackView,template){


		var Gallery = Backbone.View.extend({
			template : Handlebars.compile(template),
			

			initialize : function(attributes){
				attributes = attributes || {};
				if(typeof attributes.trackset === 'undefined'){
					throw new Error("No tracks provided for the track Gallery");
				}

				this.tracks = attributes.trackset;

				this.tracks.on("Next", function(){
					this.$('#dg-container').trigger("next");
				}, this); 
				
				this.tracks.on("Prev", function(){
					this.$('#dg-container').trigger("prev");
				}, this); 
			},

			render : function(){
				$(this.el).html(this.template());

				_.each(this.tracks.getTracks(), function(track){
					this.$(".dg-wrapper").append(new TrackView({model : track}).render());
				}, this);

				this.control = this.$('#dg-container').gallery();

				return this.el;
			}

		});

		return Gallery;

});