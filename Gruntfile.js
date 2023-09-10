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
			},
			maps: {
				src: ['maps/*.tmx'],
				dest: 'js/maps.js',
			},
		},
		replace: {
			maps: {
				src: ['js/maps.js'],
				dest: 'js/maps.js',
				replacements: [{
					from: /<map(.*?)<\/map>/g,
					to: 'var maps = maps || {}; maps["$1"] = "<map$1</map>";'
				}]
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
					src: 'images/**',
					dest: 'build/'
				}, {
					src: 'sounds/**',
					dest: 'build/'
				}, {
					src: 'maps/*',
					dest: 'build/'
				}, {
					src: 'game.html',
					dest: 'build/'
				}, {
					src: 'style.css',
					dest: 'build/'
				}]
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	
	grunt.registerTask('default', ['concat']);
	
	grunt.registerTask('build', ['concat', 'replace', 'copy:build']);
};