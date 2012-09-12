define(["soundcloud", "settings"],function(SC, settings){


	var initialized = false;

	function initializeSC(){
		SC.initialize({
			client_id : settings.soundcloud_client_id,
			redirect_uri : settings.soundcloud_redirect_uri
		});

		initialized = true;
	}

	return {
		authenticate : function(callback){
			if(!initialized){
				initializeSC();
			}

			SC.connect(function() {
			  if(typeof callback !== 'undefined'){
			  	callback();
			  }
			});
		}
	};

});