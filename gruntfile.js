module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['gruntfile.js', 'app/**/*.js', 'test/**/*.js']
    },
    copy: {
      css: {
        src: 'node_modules/normalize.css/*.css',
        dest: 'assets/css/',
        expand: true,
        flatten: true,
        filter: 'isFile'
      }
    },
    browserify: {
      'dist/app.js': ['app/**/*.js']
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

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['copy', 'browserify', 'connect', 'watch']);
};
