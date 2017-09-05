var gulp = require('gulp');

var paths = {
  vendor: [
    // 'node_modules/angular/angular.min.js',
    'bower_components/angular/angular.min.js',
    'node_modules/ng-file-upload/dist/ng-file-upload-all.min.js',
    'node_modules/angular-resource/angular-resource.min.js',
    'node_modules/angular-route/angular-route.min.js',
    'bower_components/ng-tags-input/ng-tags-input.min.js',
    'bower_components/annotorious-bower/annotorious.min.js',
    'bower_components/angular-annotorious/js/angular-annotorious.js',
    'bower_components/angular-local-storage/dist/angular-local-storage.js',
    'bower_components/angular-uuid4/angular-uuid4.js',
    'bower_components/ng-lodash/build/ng-lodash.js',
    'bower_components/jquery/dist/jquery.min.js'],
    
  dest: 'public/vendor/'
};

gulp.task('copy-vendor', [], function () {
  // move vendor scripts
  return gulp.src(paths.vendor)
    .pipe(gulp.dest(paths.dest));
});

gulp.task('default', ['copy-vendor'], function () {
});
