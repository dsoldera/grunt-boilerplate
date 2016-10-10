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
    media: 'src/media/',
    html: 'src/html/',
    breakpoint: './node_modules/breakpoint-sass',
    compass: './node_modules/compass-mixins',
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
          //flatten: true,
          cwd: '<%= defaults.scripts %>',
          src: ['**/*.js', '!react/app.js'],
          dest: '<%= defaults.dist %>/js',
          ext: '.js',
          filter: 'isFile'

        }]
      },
      media: {
        files: [{
          expand: true,
          flatten: true,
          src: ['<%= defaults.media %>**'],
          dest: '<%= defaults.dist %>/media',
          filter: 'isFile'
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: '<%= defaults.images %>',
          src: ['!normal/*.png', '*.{png,jpg,svg}'],
          dest: '<%= defaults.dist %>/img/'
          //filter: 'isFile'
        }]
      }
    },


    /*
    ** Run SpriteSmith
    */
    sprite: {
      all: {
        src: 'src/images/normal/*.png',
        dest: 'dist/img/sprites.png',
        //retinaSrcFilter: 'src/images/retina/*@2x.png',
        //retinaImgName: 'dist/img/spritesretina.png',
        //retinaDest: 'dist/img/spritesretina.png',
        destCss: 'dist/css/sprites.css'
      }
    },

    /*
    ** Compass
    */
    compass: {
      preview: {
        options: {
          imagesDir: "<%= defaults.src %>/images/",
          generatedImagesDir: "<%= defaults.dist %>/img/",
          generatedImagesPath: "<%= defaults.dist %>/img/",
          httpGeneratedImagesPath: "../img/",

          sassDir: '<%= defaults.styles %>',
          cssDir: '<%= defaults.dist %>/css/'
        }
      },
      dist: {
        options: {
          outputStyle: 'compressed',
          imagesDir: "<%= defaults.src %>/img/",
          generatedImagesDir: "<%= defaults.dist %>/img/",
          generatedImagesPath: "<%= defaults.dist %>/img/",
          httpGeneratedImagesPath: "../img/",

          sassDir: '<%= defaults.styles %>',
          cssDir: '<%= defaults.dist %>/css/'
        }
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
            dest: '<%= defaults.dist %>/img',
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
            dest: '<%= defaults.dist %>/img',
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
	        '<%= defaults.styles %>stelo-main.scss':
          [
          //'<%= defaults.styles %>/variables/*.scss',
          //'<%= defaults.styles %>/base/*.scss',
          '<%= defaults.compass %>/lib/*.scss',
          '<%= defaults.breakpoint %>/stylesheets/*.scss',
          '<%= defaults.styles %>/abstractions/*.scss',
          '<%= defaults.styles %>/helper/*.scss',
          '<%= defaults.styles %>/component/**/*.scss',
          '<%= defaults.styles %>/skin/*.scss',
          '<%= defaults.styles %>/page/*.scss'
          ]
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
        '<%= defaults.dist %>/css/stelo-main.css': '<%= defaults.styles %>/stelo-main.scss'
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
          port: 7001,
          hostname: '*',
          base: 'dist'
          //livereload: 35729,
        },
        livereload: {
          options: {
            open: {
              appName: 'Chrome'
            }
          }
        }
      }
    },

    /*
    * Include HTML
    */
    includereplace: {
      html: {
        options: {
          globals: {
            baseURL: '/preview',
            attrs: ''
          }
        },
        files: [{
          cwd: '<%= defaults.html %>',
          src: '{,*/}*.html',
          dest: '<%= defaults.dist %>',
          expand: true,
        }]
      }
    },

    /*
    ** React Compiler
    ** Browserify
    */
    browserify: {
      dev: {
        files: {
          'dist/js/app.js': ['src/scritps/react/app.js']
        },
        options: {
          transform: [["reactify", {"es6": true}]]
          //transform: [['babelify', {presets: ['es2015', 'react']}]]
        },
      }
    },

    /*
    ** React Compiler
    ** Grunt Babel
    */
    babel: {
      options: {
        //sourceMap: true,
        plugins: ['transform-react-jsx'],
        presets: ['babel-preset-es2015', 'babel-preset-react']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/scripts/react/',
          src: ['app.js'],
          dest: 'dist/js/',
          ext: '.js'
        }]
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
        tasks: ['copy:scripts'],
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
      },
      media: {
        files: '<%= defaults.media %>**',
        tasks: 'copy:media'
      },
      html: {
        files: '<%= defaults.html %>**/*.html',
        tasks: 'includereplace:html'
      }
  	}
  });

  //////////////////////////////**** TASKS *********
  // REACT Compilers
  grunt.loadNpmTasks('grunt-browserify');
  //grunt.loadNpmTasks('grunt-webpack');
  //grunt.loadNpmTasks('webpack-dev-server');

  // HTML Replace
  grunt.loadNpmTasks('grunt-include-replace');

 	//STYLES Task
  grunt.loadNpmTasks('grunt-scss-lint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.registerTask('styles', ['sass_globbing', 'sass']);

  //SCRIPTS Task
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('scripts', ['jshint']);

  //COPY Task
  //grunt.registerTask('copy-bower', ['copy:bower']);
  grunt.loadNpmTasks('grunt-contrib-copy');

  //IMAGEMIN Tasks - compress png and jpg files
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  // Task Copy All
  grunt.registerTask('copyAll', ['copy:fonts', 'copy:media', 'copy:scripts', 'copy:images']);
  //SPRITE Task
  //grunt.registerTask('sprite', ['sprite']);
  grunt.loadNpmTasks('grunt-spritesmith');

  //Default Task
  //grunt.registerTask('watch', ['watch:sass', 'watch:scripts', 'watch:images']);
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('default', [
    'connect:server',
    'includereplace',
    'styles',
    'copyAll',
    'watch'
  ]);
};
