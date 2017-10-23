let gulp = require('gulp');
let webpack = require('webpack-stream');
gulp.task('build', () => {
    return gulp.src('src/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist/'));
});