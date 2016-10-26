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
    dist: 'dist',
    third_party: 'src/third-party'
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
          cwd: '<%= defaults.fonts %>',
          src: ['*.{woff,ttf,svg}'],
          dest: '<%= defaults.dist %>/fonts',
          filter: 'isFile'
        }]
      },
      bower: {
        files: [{
          expand: true,
          flatten: true,
          src: ['<%= defaults.bower %>*min.js'],
          dest: '<%= defaults.scripts %>/vendors',
          filter: 'isFile'
        }]
      },
      scripts: {
        files: [{
          expand: true,
          //flatten: true,
          cwd: '<%= defaults.scripts %>',
          src: ['*.js', 'api/*.js', 'component/*.js', 'page/*.js'],
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
      },
      third_party: {
        files: [{
          expand: true,
          cwd: '<%= defaults.third_party %>',
          src: ['**/*.js'],
          dest: '<%= defaults.dist %>/third-party',
          filter: 'isFile'
        }]
      }
    },


    /*
    ** Run SpriteSmith
    */
    sprite: {
      all: {
        src: '<%= defaults.images %>sprites/*.png',
        dest: '<%= defaults.dist %>/img/sprites.png',
        //retinaSrcFilter: 'src/images/retina/*@2x.png',
        //retinaImgName: 'dist/img/spritesretina.png',
        //retinaDest: 'dist/img/spritesretina.png',
        destCss: '<%= defaults.dist %>/css/sprites.css'
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
    ** Checking React Code
    */
    eslint: {
      target: ['<%= defaults.scripts %>react/**/*.js']
    },


    /*
    ** Globbing all the Sass Files into the main Files **
    */
    sass_globbing: {
      globb: {
        files: {
          '<%= defaults.styles %>stelo-main.scss':
          [
          '<%= defaults.styles %>/variables/*.scss',
          '<%= defaults.breakpoint %>/stylesheets/*.scss',
          '<%= defaults.styles %>/abstractions/*.scss',
          '<%= defaults.styles %>/base/*.scss',
          //'<%= defaults.compass %>/lib/*.scss',
          //'<%= defaults.styles %>/helper/*.scss',
          '<%= defaults.styles %>/components/**/*.scss'
          //'<%= defaults.styles %>/skin/*.scss',
          //'<%= defaults.styles %>/page/*.scss'
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
      all:['<%= defaults.styles %>**/*.scss'],
      options: {
        //bundleExec: true,
        config: '.scss-lint.yml',
        reporterOutput: '.qualityReports/scss-lint-report.json',
        colorizeOutput: true,
        maxBuffer: 580400,
        exclude: [
          '<%= defaults.styles %>abstractions/_normalize.scss',
          '<%= defaults.styles %>stelo-main.scss'
        ]
      }
    },

    /*
    ** Connect  Server
    */
    connect: {
      server: {
        options: {
          port: 7001,
          open: true,
          hostname: '*',
          base: 'dist',
          livereload: 35729
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
    ** Compile React
    */
    browserify: {
      dist: {
        options: {
           transform: [['babelify', {presets: ['react','es2015','stage-2']}]]
        },
        src: ['<%= defaults.scripts %>react/index.js'],
        dest: '<%= defaults.dist %>/js/app.js',
      }
    },

    uglify: {
      dist: {
          options: {
              mangle: true,
              compress: {
                drop_console: true
              },
              beautify: false
          },
          files: [{
              expand: true,
              cwd: '<%= defaults.scripts %>',
              src: ['api/*.js', 'component/**/*.js', 'page/*.js', '*.js'],
              dest: '<%= defaults.dist %>/js'
          }]
      },
      distTp: {
          options: {
            mangle: true,
            compress: {
              drop_console: true
            },
            beautify: false
          },
          files: [{
            expand: true,
            cwd: '<%= defaults.third_party %>',
            src: [
                '**/*.js',
                '!lodash/**' /* lodash apresenta erro ao ser compactado com uglify*/
            ],
            dest: '<%= defaults.dist %>/third-party'
          }]
      }
    },


    /*
     * Watch module
     */
    watch: {
      options: {
        livereload: true,
        dateFormat: function(time) {
          grunt.log.writeln('The watch finished in ' + time + 'ms at ' + (new Date()).toString());
          grunt.log.writeln('Waiting for more changes...');
        },
      },
      sass: {
        files: '<%= defaults.styles %>**/*.scss',
        tasks: ['sass_globbing', 'sass', 'scsslint'],
        options: {
          livereload: true,
        },
      },
      scripts: {
        files: '<%= defaults.scripts %>**/*.{js}',
        tasks: ['uglify:dist'],
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
        files: '<%= defaults.html %>*.html',
        tasks: 'includereplace:html'
      }
    }
  });

  //////////////////////////////**** TASKS *********
  //Compile React
  grunt.loadNpmTasks('grunt-browserify');

  // HTML Replace
  grunt.loadNpmTasks('grunt-include-replace');

  //STYLES Task
  grunt.loadNpmTasks('grunt-scss-lint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.registerTask('styles', ['sass_globbing', 'sass']);

  //SCRIPTS Task
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('scripts', ['uglify:dist', 'uglify:distTp']);

  //COPY Task
  //grunt.registerTask('copy-bower', ['copy:bower']);
  grunt.loadNpmTasks('grunt-contrib-copy');

  //IMAGEMIN Tasks - compress png and jpg files
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  // Task Copy All
  grunt.registerTask('copyAll', ['copy:fonts', 'copy:media', 'copy:images', 'copy:third_party']);
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
    'scripts',
    'copyAll',
    'watch'
  ]);
};
