module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['gruntfile.js', 'app/**/*.js', 'test/**/*.js']
    },
    browserify: {
      'dist/bundle.js': ['app/app.js']
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'browserify']
    },
    connect: {
      server: {
        options: { port: 8000 }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-browserify');
  
  grunt.registerTask('default', ['connect', 'watch']);
};
