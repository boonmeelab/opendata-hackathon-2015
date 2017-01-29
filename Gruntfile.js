module.exports = function(grunt) {

  // Load required plugins
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-bower-task');
  // grunt.loadNpmTasks('grunt-bower-requirejs');

  // Tasks
  grunt.registerTask('build', ['clean', 'copy', 'bower', 'sass', 'jade']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('watch', ['build', 'watch']);
  // grunt.registerTask('local', ['compile:local']);
  // grunt.registerTask('product', ['compile:product']);


  // grunt.registerTask('compile:local', [/*'bowerRequirejs', 'uglify',*/ 'jade']);
  // grunt.registerTask('compile:product', [/*'bowerRequirejs', 'uglify',*/ 'jade']);


  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      local: {
        files: [
          {expand: true, cwd: 'src/js/', src: ['**'], dest: 'dist/public/js/'},
          {expand: true, cwd: 'src/image/', src: ['**'], dest: 'dist/public/image/'},
          {expand: true, cwd: 'src/data/', src: ['**'], dest: 'dist/public/data/'}
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

    jade: {
      compile: {
        options: {
          pretty: true,
          data: {
            debug: false,
            title: ""
          },
          compileDebug: false,
          client: false,
          // wrapper: 'amd',
          // amd: true
        },
        files: [
          {
          expand: true,     // Enable dynamic expansion.
          cwd: 'src/jade/',      // Src matches are relative to this path.
          src: ['**/*.jade'], // Actual pattern(s) to match.
          dest: 'dist/',   // Destination path prefix.
          ext: '.html',   // Dest filepaths will have this extension.
          }
        ],
      }
    },

    sass: {
      options: {
        includePaths: [
          'dist/public/dep/sass-css3-mixins'
        ]
      },
      dist: {
        options: {
          outputStyle: 'expanded'
        },
        files: {
          'dist/public/css/main.css': 'src/scss/main.scss'
        }
      }
    },

    bower: {
      install: {
         //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
      }
    },

    // bowerRequirejs: {
    //   target: {
    //     rjsConfig: 'src/js/config.js',
    //     options: {
    //       baseUrl: './dist/public/js',
    //       transitive: true
    //     }
    //   }
    // },

    clean: {
      options: {
        // "no-write": true
      },
      local: [
        'dist'
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
      view: {
        files: ['src/jade/**/*.jade'],
        tasks: ['jade']
      },
      sass: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass']
      }

    },
  });

};
