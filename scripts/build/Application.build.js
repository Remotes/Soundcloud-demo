({
    baseUrl: "../",
    paths: {
	    "libs" : "libs",
      "models" : "models",
      "templates" : "../templates",
      "jquery" : "libs/jquery",
      "underscore" : "libs/underscore",
      "Backbone" : "libs/backbone",
      "text" : "libs/text",
      "soundcloud" : "libs/soundcloud",
      "handlebars" : "libs/handlebars",
      "modernizr" : "libs/modernizr",
      "requireLib" : "libs/require",
      "settings" : "settings.prod",
      "remotes" : "https://raw.github.com/Remotes/Remotes/master/dist/remotes.min"//"libs/api.client"
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
        "libs/api.client" : []
  	},

    
    //optimize: "none",   
    name: "requireLib", 
    include : "Application",
    out: "../distrib/application.js"
})
