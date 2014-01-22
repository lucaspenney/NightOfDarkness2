module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			scripts: {
				files: ['js/*.js'],
				tasks: ['concat']
			}
		},
		concat: {
			compile: {
				src: 'js/*',
				dest: 'compiled.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['concat']);
};