import gulp from 'gulp';
import plugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import runSequence from 'run-sequence';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import historyApiFallback from 'connect-history-api-fallback';
import yargs from 'yargs';
import rimraf from 'rimraf';
import {exec} from 'child_process';

const $ = plugins();
const server = browserSync.create();

gulp.task('reload', () => {
  server.reload();
});

function runCommand(cmd, done) {
  var ls = exec(cmd);
  ls.stdout.on('data', (data) => {
    console.log(data);
  });
  ls.stderr.on('data', (data) => {
    console.log(data);
  });
  ls.on('close', () => {
    done && done();
  });
}

gulp.task('server', () => {
  const config = require('./webpack.config').default;
  let bundle = webpack(config);

  let middleware = [historyApiFallback()];
  if(process.env.stage === 'development') {
    middleware.push(webpackDevMiddleware(bundle, {
      publicPath: config.output.publicPath,
      stats: {
        colors: true
      },
      noInfo: true,
      historyApiFallback: true
    }));

    middleware.push(webpackHotMiddleware(bundle));
  }

  server.init({
    files: ['./dist/*.html', './dist/*.css'],
    notify: true,
    server: {
      baseDir: './dist',
      middleware: middleware
    }
  });
});


gulp.task('watch', () => {
  $.watch('./client/src/*.html', () => {
    runSequence('html', 'reload');
  });
});

gulp.task('set:version', (done) => {
  yargs
    .usage('gulp [task] -v=[version]')
    .option('version', {
      alias: 'v',
      describe: 'Product Version',
      type: 'string',
      demand: false
    })
    .help('help').argv;
  process.env.version = require('./package.json').version;
  if(yargs.argv.version) {
    process.env.version = yargs.argv.version;
  }

  done();
});

gulp.task('bundle', (done) => {
  let doneCalled = false;
  let config = require('./webpack.config').default;

  webpack(config, (err, stats) => {
    console.log(stats.toString('errors-only'));
    if (!doneCalled) {
      doneCalled = true;
      done();
    }
  });
});

gulp.task('clean:dist', done => rimraf('./dist', done));

gulp.task('size', () => {
  return gulp
    .src('./dist/**/*')
    .pipe($.size());
});

gulp.task('env:dev', ['set:version'], () => {
  process.env.NODE_ENV = 'development';
  process.env.stage = 'development';
});
gulp.task('env:stable', ['set:version'], () => {
  process.env.NODE_ENV = 'stable';
  process.env.stage = 'stable';
});



gulp.task('build', (done) => {
  runSequence('clean:dist', 'env:stable', 'bundle', ['size'], done);
});


gulp.task('serve', (done) => {
  runSequence('clean:dist', 'env:dev', ['server', 'watch'], done);
});

gulp.task('serve:beta', (done) => {
  runSequence('build:beta', ['server'], done);
});

gulp.task('serve:stable', (done) => {
  runSequence('build', ['server'], done);
});
