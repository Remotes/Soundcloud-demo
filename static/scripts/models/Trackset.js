define(["Backbone", "underscore", "models/Track"],function(Backbone, _, Track){


	function Trackset(tracks){
		if(typeof tracks === 'undefined'){
			throw new Error("Trackset need tracks. C'mon.");
		}

		this.tracks = tracks;
		this.currentTrackIndex = 0;
	}

	 _.extend(Trackset.prototype, Backbone.Events, {

	 	playing : false,
	 	currentSound : null,

		getTracks : function(){
			return this.tracks;
		},

		getCurrent : function(){
			return this.tracks[this.currentTrackIndex];
		},

		__currentSound : function(){
			return this.currentSound ? this.currentSound : this.getCurrent().getSound();				
		},

		toggle : function(){

			this.playing = !this.playing;

			this.trigger("Toggle");

			$.when(this.__currentSound()).done(_.bind(function(sound){	
				this.currentSound = sound;
				this.currentSound.togglePause();
			},this));
		},

		next : function(){
			this.currentTrackIndex = 
				this.currentTrackIndex === (this.tracks.length - 1) ? 0 : this.currentTrackIndex + 1;
			
			this.trigger("Next");
		
			if(this.playing){
				this.currentSound.stop();
			}

			$.when(this.getCurrent().getSound()).done(_.bind(function(sound){
				this.currentSound = sound;

				if(this.playing){					
					this.currentSound.play();
				}
			},this));
		},

		prev : function(){
			this.currentTrackIndex = 
				this.currentTrackIndex === 0 ? this.tracks.length - 1 : this.currentTrackIndex - 1; 

			this.trigger("Prev");

			if(this.playing){
				this.currentSound.stop();
			}

			$.when(this.getCurrent().getSound()).done(_.bind(function(sound){
				this.currentSound = sound;

				if(this.playing){
					this.currentSound.play();
				}
			},this));
		}
	});


	return Trackset;

});