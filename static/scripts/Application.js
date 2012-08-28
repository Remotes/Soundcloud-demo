requirejs.config({      
  paths: {
    "libs" : "libs",
    "models" : "models",
    "templates" : "../templates",
    "jquery" : "libs/jquery",
    "underscore" : "libs/underscore",
    "Backbone" : "libs/backbone",
    "text" : "libs/text",
    "soundcloud" : "http://connect.soundcloud.com/sdk", 
    "handlebars" : "libs/handlebars",
    "modernizr" : "libs/modernizr",
    "remoats" : "libs/api.client"
  },

  shim: {
    'jquery' : {
      exports: '$'
    },

    'underscore' : {
      exports: '_'
    },

    'Backbone' : {
      deps : ['underscore'],
      exports: 'Backbone'
    },

    "soundcloud" : {
      exports: 'SC'
    },

    "handlebars" : {
      exports: 'Handlebars'
    }, 

    "modernizr" : [],

    "libs/backbone.tyler" : ['Backbone', 'handlebars'],
    "libs/jquery.gallery" : ['jquery', 'modernizr'],
    "api.client" : []

  },

  waitSeconds: 15,
  urlArgs: "bust=" +  (new Date()).getTime()

});

require([
  "jquery", "models/Authentication", 
  "models/Favorites",  
  "models/Trackset",
  "models/RemoteControl",
  "views/TrackGallery",
  "views/Player"
], function($,Authentication, Favorites, Trackset, RemoteControl, TrackGalleryView, PlayerView) {

    $(document).ready(function(){
      Authentication.authenticate(function(){
        
        $.when(Favorites.get()).done(function(favs){
          
          var trackset = new Trackset(favs.models);
          var remoteControl = new RemoteControl();

          remoteControl.on("ready", function(){
            $("#gallery").append(new TrackGalleryView({ trackset : trackset }).render());
            $("#player").html(new PlayerView({ trackset : trackset }).render());
          
            $(".loading").remove();

          });

          remoteControl.on("next", function(){ trackset.next(); });
          remoteControl.on("prev", function(){ trackset.prev(); });
          remoteControl.on("toggle", function(){ trackset.toggle(); });

          console.log("got Favorites: ", favs);
        });

      });
    });

});
