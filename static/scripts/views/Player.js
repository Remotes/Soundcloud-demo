define(["jquery", "Backbone", "handlebars", "text!templates/player.html"], 
	function($, Backbone, Handlebars, template){


		var Player = Backbone.View.extend({

			events : {
				"click .prev" : "onPrev",
				"click .next" : "onNext",
				"click .toggle" : "onToggle"
			},

			template : Handlebars.compile(template),

			playing : false,

			initialize : function(attributes){
				attributes = attributes || {};

				if(typeof attributes.trackset === 'undefined'){
					throw new Error("Player needs a trackset");
				}

				this.trackset = attributes.trackset;
				this.trackset.on("Toggle", function(){
					this.$(".toggle").toggleClass("play");
					this.$(".toggle").toggleClass("stop");
				}, this);
			},

			render : function(){
				$(this.el).html(this.template());
				return this.el;
			},

			onPrev : function(){
				this.trackset.prev();
			},

			onNext : function(){
				this.trackset.next();
			},

			onToggle : function(){
				this.trackset.toggle();
			}

		});

		return Player; 

});