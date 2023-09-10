var gulp = require('gulp');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var copy = require('gulp-copy');
var through2 = require('through2');
var path = require('path');

gulp.task('concat', function() {
    return gulp.src(['maps/maps.js', 'js/*.js'])
        .pipe(concat('compiled.js'))
        .pipe(gulp.dest('./build/'));
});

//generate a maps.js file which will contain a json object, each key of the object being the filename of the file in maps/ directory and the value will be the string of xml from the tmx in the maps directory. 
gulp.task('build-maps', function(){
    return gulp.src('maps/*.tmx')
        .pipe(through2.obj(function(file, enc, cb) {
            var filename = path.basename(file.path, '.tmx');
            var content = file.contents.toString();

            var result = 'var maps = maps || {}; maps["' + 'maps/' + filename + '.tmx' + '"] = `' + content + '`;';
            file.contents = Buffer.from(result);
            this.push(file);
            cb();
        }))
        .pipe(concat('maps.js'))
        .pipe(gulp.dest('maps/'));
});
gulp.task('uglify', function() {
    return gulp.src('js/*.js')
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('build/'));
});

gulp.task('copy', function() {
    return gulp.src(['images/**/*', 'sounds/**/*', 'game.html', 'style.css'])
        .pipe(copy('./build/'));
});

gulp.task('watch', function() {
    gulp.watch('js/*.js', gulp.series('concat'));
});

gulp.task('default', gulp.series('concat'));

gulp.task('build', gulp.series('build-maps', 'concat', 'copy'));