module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'app/components/*/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.registerTask('build', ['jshint']);

  grunt.registerTask('test', [  
    'jshint',
    'karma'
  ]);
};
