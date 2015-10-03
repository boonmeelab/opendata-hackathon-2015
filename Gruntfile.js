module.exports = function(grunt) {

  // Load required plugins
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  // grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-sass');
  // grunt.loadNpmTasks('grunt-bower-requirejs');

  // Tasks
  grunt.registerTask('build', ['sass']);
  grunt.registerTask('default', ['build','watch']);
  // grunt.registerTask('local', ['compile:local']);
  // grunt.registerTask('product', ['compile:product']);


  // grunt.registerTask('compile:local', [/*'bowerRequirejs', 'uglify',*/ 'jade', 'stylus']);
  // grunt.registerTask('compile:product', [/*'bowerRequirejs', 'uglify',*/ 'jade', 'stylus']);


  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      local: {
        files: [
          {expand: true, cwd: 'src/js/', src: ['**'], dest: 'public/js/'}
        ]
      }
    },

    // uglify: {
    //   options: {
    //     banner: '/*!\n * @license\n * <%= pkg.description %> <%= pkg.version %> <<%= pkg.homepage %>>\n * Copyright 2013-2014 Boonmee Lab. <boonmeelab@gmail.com>\n */\n'
    //   },
    //   js: {
    //     expand: true,     // Enable dynamic expansion.
    //     cwd: 'src/js/',      // Src matches are relative to this path.
    //     src: ['*.js', 'component/*.js', 'model/*.js', 'page/*.js', 'translate/*.js'],
    //     dest: 'public/js/',   // Destination path prefix.
    //     ext: '.js',   // Dest filepaths will have this extension.
    //   },
    // },

    // jade: {
    //   compile: {
    //     options: {
    //       pretty: true,
    //       data: {
    //         debug: false,
    //         title: ""
    //       },
    //       compileDebug: false,
    //       client: true,
    //       wrapper: 'amd',
    //       amd: true
    //     },
    //     files: [
    //       {
    //       expand: true,     // Enable dynamic expansion.
    //       cwd: 'src/jade/',      // Src matches are relative to this path.
    //       src: ['**/*.jade'], // Actual pattern(s) to match.
    //       dest: 'public/view/',   // Destination path prefix.
    //       ext: '.js',   // Dest filepaths will have this extension.
    //       }
    //     ],
    //   }
    // },

    // stylus: {
    //   compile: {
    //     options: {
    //       compress: false,
    //       'resolve url': true
    //     },
    //     files: [
    //       {
    //       expand: true,     // Enable dynamic expansion.
    //       cwd: 'src/stylus/',      // Src matches are relative to this path.
    //       src: ['**/*.styl'], // Actual pattern(s) to match.
    //       dest: 'public/css/',   // Destination path prefix.
    //       ext: '.css',   // Dest filepaths will have this extension.
    //       }
    //     ]
    //   }
    // },

    sass: {
      options: {
        includePaths: [
          'public/dep/sass-css3-mixins'
        ]
      },
      dist: {
        options: {
          outputStyle: 'expanded'
        },
        files: {
          'public/css/main.css': 'src/scss/main.scss'
        }
      }
    },


    // bowerRequirejs: {
    //   target: {
    //     rjsConfig: 'src/js/config.js',
    //     options: {
    //       baseUrl: './public/js',
    //       transitive: true
    //     }
    //   }
    // },

    clean: {
      options: {
        // "no-write": true
      },
      local: [
        'public/js',
        'public/css',
        'public/view',
      ]
    },

    watch: {
      options: {
        livereload: 3367,
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['copy']
      },
      // view: {
      //   files: ['src/jade/**/*.jade'],
      //   tasks: ['jade']
      // },
      // css: {
      //   files: ['src/stylus/**/*.styl'],
      //   tasks: ['stylus']
      // }
      sass: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass']
      }

    },
  });

};
