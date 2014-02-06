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
		},
		uglify: {
			options: {
				mangle: false
			},
			build: {
				src: 'js/*.js',
				dest: 'build/compiled.js'
			}
		},
		copy: {
			build: {
				files: [{
					src: 'images/*',
					dest: 'build/images/'
				}, {
					src: 'sounds/*',
					dest: 'build/sounds/'
				}, {
					src: 'maps/*',
					dest: 'build/maps/'
				}, {
					src: 'game.html',
					dest: 'build/'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['concat']);
	grunt.registerTask('build', ['copy:build', 'uglify:build']);
};