const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const flow = require('gulp-flowtype');
const execSync = require('child_process').execSync;

gulp.task('scripts', () => {
  return gulp.src('src/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('build'));
});

gulp.task('flow', () => {
  return gulp.src('src/**/*.js')
  .pipe(flow({
    all: true,
    killFlow: false,
    declarations: './flow-typed'
  }));
});

gulp.task('flowCheck', () => {
  try {
    execSync('./node_modules/.bin/flow', { stdio: 'inherit' });
  } catch (e) {
  }
});

gulp.task('watch', ['flowCheck', 'flow', 'scripts'], () => {
  gulp.watch('src/**/*.js', ['flow', 'scripts']);
});

gulp.task('default', ['watch']);
