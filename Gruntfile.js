module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: [
        'Gruntfile.js', 
        'app/components/*/*.js',
        'backend/app.js',
        'backend/routes/*.js'
      ],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    connect: {
      server: {
        options: {
          livereload: true,
          port: 8010,
          base: ''
        },
      }
    },
    watch: {
      options: {
        livereload: true,
      },
      html: {
        files: ['index.html',
          'app/**/*.html']
      },
      js: {
        files: [
          'app/**/*.js',
          'app.js'
        ]
      }
    },
    karma: {  
      unit: {
        singleRun: true,
        options: {
          frameworks: ['jasmine'],
          browsers: ['PhantomJS'],
          files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'node_modules/angular-route/angular-route.js',
            'app.js',
            'app/components/main/main-ctrl.js',
            'app/components/**/*.js',
            'app/services/lolapi.js'
          ]
        }  
      }
    },
    concat: {
      dist: {
        src: [
          'app/components/**/*.scss'
        ],
        dest: 'styles/build.scss'
      }
    },
    sass: {                                 // Task
      dist: {
        files: {
          'styles/build.css':'styles/build.scss'
        }

      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.registerTask('build', ['jshint']);
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('buildcss', ['concat', 'sass']);

  grunt.registerTask('test', [  
    'jshint',
    'karma'
  ]);

  grunt.registerTask('serve', [
    'buildcss',
    'connect',
    'watch'
  ]);
};
