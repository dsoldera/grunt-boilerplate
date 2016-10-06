'use strict';

module.exports = function (grunt) {

	//** Time how long tasks take. Can help when optimizing build times **/
  require('time-grunt')(grunt);
  //** Automatically load required Grunt tasks **/
  // require('jit-grunt')(grunt, {
  //   sprite: 'grunt-spritesmith',
  // });
  require('jit-grunt')(grunt);

  //grunt default variables
  var defaults = {
    app: '.',
    preview: 'preview',
    src: 'src',
    styles: 'src/styles/',
    fonts: 'src/fonts/',
    scripts: 'src/scripts/',
    images: 'src/images/',
    breakpoint: './node_modules/breakpoint-sass',
    bower: 'bower_components/**/',
    dist: 'dist'
  };

  //** Define the configuration for all the tasks **/
  grunt.initConfig({
  	pkg: grunt.file.readJSON('package.json'),

		defaults: defaults,

    /*
    ** Copy files from SRC to Preview or Dist **
    */
    copy: {
      fonts: {
        files: [{
          expand: true,
          src: ['<%= defaults.fonts %>**'],
          dest: '<%= defaults.dist %>/fonts',
          filter: 'isFile'
        }]
      },
      bower: {
        files: [{
          expand: true,
          flatten: true,
          src: ['<%= defaults.bower %>*min.js'],
          dest: '<%= defaults.scripts %>/contrib',
          filter: 'isFile'
        }]
      },
      scripts: {
        files: [{
          expand: true,
          flatten: true,
          src: ['<%= defaults.scripts %>**/*.js'],
          dest: '<%= defaults.dist %>/scripts',
          filter: 'isFile'
        }]
      }
    },


    /*
    ** Run SpriteSmith
    */
    sprite: {
      all: {
        src: 'src/images/sprites/*.png',
        dest: 'dist/images/sprites.png',
        retinaSrcFilter: 'src/images/sprites/*@2x.png',
        retinaImgName: 'dist/images/spritesretina.png',
        retinaDest: 'dist/images/spritesretina.png',
        destCss: 'src/styles/sprites.css'
      }
    },


    /*
    ** Imagemin
    */
    imagemin: {
      png: {
        options: {
          optimizationLevel: 7
        },
        files: [
          {
            expand: true,
            cwd: '<%= defaults.images %>',
            src: ['*.png'],
            dest: '<%= defaults.dist %>/images',
            ext: '.png'
          }
        ]
      },
      jpg: {
        options: {
          progressive: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= defaults.images %>',
            src: ['*.jpg'],
            dest: '<%= defaults.dist %>/images',
            ext: '.jpg'
          }
        ]
      }
    },

  	/*
  	 * JS Hint module
  	 */
  	jshint: {
  	  options: {
        reporter: require('jshint-html-reporter'),
        reporterOutput: '.qualityReports/jshint-report.html'
  	  },
  	   target: ['<%= defaults.scripts %>custom/*.js'],
  	},


  	/*
		** Globbing all the Sass Files into the main Files **
		*/
  	sass_globbing: {
	    globb: {
	      files: {
	        '<%= defaults.styles %>/styles/stelo-main.scss':
	        ['<%= defaults.styles %>/variables/*.scss',
	        '<%= defaults.styles %>/abstractions/*.scss',
	        '<%= defaults.breakpoint %>/stylesheets/*.scss',
	        '<%= defaults.styles %>/base/*.scss',
	        '<%= defaults.styles %>/components/*.scss']
	      },
	      options: {
	        useSingleQuotes: true
	      }
	    }
  	},

  	/*
  	** SASS Task to build CSS from SCSS **
  	*/
  	sass: {
     options: {
        sourceMap: true
        //outputStyle: 'compressed'
     },
     dist: {
       files: {
        '<%= defaults.dist %>/css/stelo-main.css': '<%= defaults.styles %>/*.scss'
       }
     }
  	},

    /*
    ** Task to validate SCSS files
    */
    scsslint: {
      scsslint: {
        allFiles: [
          'src/styles/abstractions/*.scss',
        ],
        options: {
          bundleExec: true,
          config: '.scss-lint.yml',
          reporterOutput: '.qualityReports/scss-lint-report.json',
          colorizeOutput: true,
          maxBuffer: 307200,
        },
      }
    },

    /*
    ** Connect  Server
    */
    connect: {
      server: {
        options: {
          port: 9000,
          hostname: 'localhost',
          livereload: 35729
        },
        livereload: {
          options: {
            open: true
          }
        }
      }
    },

  	/*
  	 * Watch module
  	 */
  	watch: {
      options: {
        livereload: {
          host: 'localhost',
          port: 9000,
        },
        dateFormat: function(time) {
          grunt.log.writeln('The watch finished in ' + time + 'ms at ' + (new Date()).toString());
          grunt.log.writeln('Waiting for more changes...');
        },
      },
  	  sass: {
  	    files: '<%= defaults.styles %>**/*.scss',
  	    tasks: ['sass_globbing', 'sass' ],
        options: {
          livereload: true,
        },
  	  },
      scripts: {
        files: '<%= defaults.scripts %>**/*.js',
        tasks: ['jshint', 'copy:scripts'],
        options: {
          livereload: true,
        },
      },
      images: {
        files: ['<%= defaults.images %>*.jpg', '<%= defaults.images %>*.png'],
        tasks: 'imagemin'
      },
      fonts: {
        files: '<%= defaults.fonts %>**',
        tasks: 'copy:fonts'
      },
      sprites: {
        files: '<%= defaults.images %>sprites/**',
        tasks: 'sprite'
      }
  	}
  });

  //////////////////////////////**** TASKS *********
 	//STYLES Task
  grunt.loadNpmTasks('grunt-scss-lint');
  grunt.registerTask('styles', ['sass_globbing', 'sass', 'scsslint']);

  //SCRIPTS Task
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('scripts', ['jshint']);

  //COPY Task
  //grunt.registerTask('copy-bower', ['copy:bower']);
  grunt.loadNpmTasks('grunt-contrib-copy');

  //IMAGEMIN Tasks - compress png and jpg files
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  //SPRITE Task
  //grunt.registerTask('sprite', ['sprite']);
  grunt.loadNpmTasks('grunt-spritesmith');

  //Default Task
  //grunt.registerTask('watch', ['watch:sass', 'watch:scripts', 'watch:images']);
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('default', ['watch']);
};
