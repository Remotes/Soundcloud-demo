define(["soundcloud"],function(SC){


	var initialized = false;

	function initializeSC(){
		SC.initialize({
		  
		  //client_id: '524bf31280dee11483b0953c15bef057',
		  //redirect_uri: 'http://localhost:8000/demos/soundcloud/callback/'
			client_id : '7ea20be4fd2fc0ba7c8ddde32ca361ae',
			redirect_uri : 'http://ec2-174-129-174-76.compute-1.amazonaws.com/demos/soundcloud/callback/'
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