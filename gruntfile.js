'use strict';

module.exports = function (grunt) {

  //** Time how long tasks take. Can help when optimizing build times **/
  require('time-grunt')(grunt);
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
      css: {
        src: '<%= defaults.images %>sprites/*.png',
        dest: '<%= defaults.dist %>/img/sprites.png',
        //retinaSrcFilter: 'src/images/retina/*@2x.png',
        //retinaImgName: 'dist/img/spritesretina.png',
        //retinaDest: 'dist/img/spritesretina.png',
        imgPath: '/img/sprite.png',
        destCss: '<%= defaults.dist %>/css/sprites.css'
      },
      scss: {
        src: '<%= defaults.images %>sprites/*.png',
        dest: '<%= defaults.dist %>/img/sprites.png',
        imgPath: '/img/sprites.png',
        destCss: '<%= defaults.styles %>abstractions/_sprites.scss'
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
          '<%= defaults.styles %>main-styles.scss':
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
        '<%= defaults.dist %>/css/main-styles.css': '<%= defaults.styles %>/main-styles.scss'
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
          '<%= defaults.styles %>main-styles.scss'
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
    ** PostCss
    */
    postcss: {
      options: {
        map: true, // inline sourcemaps
        processors: [
          //require('pixrem')(), // add fallbacks for rem units
          //require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
          require('lost'),
          require('cssnano')
        ]
      },
      dist: {
        src: '<%= defaults.dist %>/css/*.css'
      }
    },

    /*
    * Babel plugin to convert ES6 Scrtipts to Browser reader
    */
    babel: {
      options: {
        sourceMap: true,
        presets: ['babel-preset-es2015', 'babel-preset-stage-2']
      },
      dist: {
        files: {
          '<%= defaults.dist %>/js/app.js': '<%= defaults.scripts %>app.es6'
        }
      }
    },


    /*
    * Compile ES6 into Javascript ES5 using necessary plugins
    */
    browserify: {
      es6: {
        options: {
           transform: [['babelify', {presets: ['es2015','stage-2']}]],
           debug: true,
           require: [ 'jquery', 'malihu-custom-scrollbar-plugin']
        },
        src: ['<%= defaults.scripts %>app.es6'],
        dest: '<%= defaults.dist %>/js/app.js',
      }
    },


    /*
    * Grunt Uglify - Plugin to format the Javascript and compile a final version
    * There is a option to remove console.log and others
    */
    uglify: {
      dist: {
          options: {
              mangle: true,
              compress: {
                //drop_console: true
              },
              beautify: false
          },
          files: [{
              expand: true,
              cwd: '<%= defaults.scripts %>',
              //src: ['api/*.js', 'component/**/*.js', 'page/*.js', '*.js'],
              src: 'main.js',
              dest: '<%= defaults.dist %>/js'
          }]
      },
      distTp: {
          options: {
            mangle: true,
            compress: {
              //drop_console: true
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
        tasks: ['sass_globbing', 'sass', /*'scsslint', */'postcss'],
        options: {
          livereload: true,
        },
      },
      scripts: {
        files: '<%= defaults.scripts %>**/*.{js}',
        tasks: ['jshint', 'uglify:dist', 'browserify:es6'],
        options: {
          //livereload: true,
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
        tasks: 'sprite:scss'
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
    // HTML Replace
  grunt.loadNpmTasks('grunt-include-replace');

  //STYLES Task
  grunt.loadNpmTasks('grunt-scss-lint');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.registerTask('styles', ['sass_globbing', 'sass', 'postcss']);

  //SCRIPTS Task
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
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
