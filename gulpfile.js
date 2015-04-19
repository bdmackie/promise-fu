var gulp = require('gulp');
var mocha = require('gulp-mocha');

// Test
gulp.task('test', [], function () {
    console.log('start test');
    gulp.src('test/**/test-*.js', {read: false})
        .pipe(mocha({reporter: 'spec', recursive: true}));
});
