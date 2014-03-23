module.exports = function(grunt) {"use strict";
	grunt.initConfig({
		clean : ["dist/"],
		jshint : {
			all : ['Gruntfile.js', 'app/*.js', 'app/modules/*.js']
		},
		handlebars : {
			compile : {
				options : {
					namespace : "JST"
				},
				files : {
					"dist/precompiledTemplates.js" : ["app/templates/**/*.html"]
				}
			}
		},
		concat : {
			dist : {
				src : ["assets/components/almond/almond.js", "dist/require.js"],

				dest : "dist/sources.js",

				separator : ";"
			}
		},

		targethtml : {
			release : {
				src : "index.html",
				dest : "dist/index.html"
			}
		},
		requirejs : {
			compile : {
				options : {
					mainConfigFile : "app/config.js",
					out : "dist/require.js",
					name : "config",
					wrap : false
				}
			}
		},
		styles : {
			"dist/styles.css" : {
				src : "app/css/index.css",
				paths : ["app/css"],
				prefix : "app/css/"
			}
		},
		cssmin : {
			"dist/index.css" : ["dist/styles.css"]
		}
	});
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-bbb-styles');
	grunt.loadNpmTasks('grunt-targethtml');
	
	grunt.registerTask("default", ["clean", "jshint", "handlebars", "requirejs", "concat", "styles", "cssmin", "targethtml"]);
};
