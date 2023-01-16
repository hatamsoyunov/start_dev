import gulp from 'gulp';
import browsersync from 'browser-sync';
import bssi from 'browsersync-ssi';
import ssi from 'ssi';
import babel from 'gulp-babel';
import cleancss from 'gulp-clean-css';
import rename from 'gulp-rename';
import autoprefixer from 'gulp-autoprefixer';
import notify from 'gulp-notify';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import nodeSass from 'node-sass';
import { deleteAsync } from 'del';
import gulpSass from 'gulp-sass';
// SVG sprite
import svgStore from 'gulp-svgstore';
import svgMin from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';

const { src, dest, parallel, series, watch } = gulp;
const sass = gulpSass(nodeSass);

const watchFileTypes = 'html,json,woff,woff2'; // List of files extensions for watching & hard reload

const cssLibsPaths = ['node_modules/magnific-popup/dist/magnific-popup.css'];

const jsLibsPaths = [
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
  'node_modules/inputmask/dist/jquery.inputmask.min.js',
];

// Tasks
function jsLibs() {
  return src(jsLibsPaths).pipe(concat('libs.min.js')).pipe(uglify()).pipe(dest('src/js')).pipe(browsersync.stream());
}

function js() {
  return src('src/js/main.js')
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('src/js'))
    .pipe(browsersync.stream());
}

function cssLibs() {
  return src(cssLibsPaths)
    .pipe(concat('libs.min.css'))
    .pipe(autoprefixer(['last 10 versions']))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
    .pipe(dest('src/css'))
    .pipe(browsersync.stream());
}

function css() {
  return src('src/sass/main.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError()))
    .pipe(autoprefixer(['last 10 versions']))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('src/css'))
    .pipe(browsersync.stream());
}

function svgSprite() {
  return src('src/img/svg-sprite/*.svg')
    .pipe(
      svgMin(function (file) {
        var prefix = path.basename(file.relative, path.extname(file.relative));
        return {
          plugins: [
            {
              cleanupIDs: {
                prefix: prefix + '-',
                minify: true,
              },
            },
          ],
        };
      }),
    )
    .pipe(
      cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[fill-opacity]').removeAttr('fill-opacity');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
          $('[data-name]').removeAttr('data-name');
        },
        parserOptions: { xmlMode: true },
      }),
    )
    .pipe(svgStore())
    .pipe(dest('src/img/'));
}

function browserSync() {
  browsersync.init({
    server: {
      baseDir: 'src',
      middleware: bssi({ baseDir: 'src/', ext: '.html' }),
    },
    ghostMode: { clicks: false },
    notify: false,
    open: false,
    // tunnel: 'yousitename', // Attempt to use the URL https://yousutename.loca.lt
  });
}

function buildCopy() {
  return src(['{src/js,src/css}/*.min.*', 'src/assets/**/*', 'src/*.html'], {
    base: 'src/',
  }).pipe(dest('dist'));
}

async function buildHtml() {
  const includes = new ssi('app/', 'dist/', '/**/*.html');
  
  includes.compile();
  await deleteAsync('dist/parts', { force: true });
}

async function cleanDist() {
  await deleteAsync('dist/**/*', { force: true });
}

function startWatch() {
  watch('src/sass/**/*.sass', { usePolling: true }, css);
  watch(['src/js/**/*.js', '!src/js/**/*.min.js'], { usePolling: true }, js);
  watch('src/assets/svg-sprite/*.svg', { usePolling: true }, svgSprite);
  watch(`src/**/*.{${watchFileTypes}}`, { usePolling: true }).on('change', browsersync.reload);
}

// Export
export const build = series(cleanDist, jsLibs, js, cssLibs, css, buildCopy, buildHtml);
export default series(jsLibs, js, cssLibs, css, svgSprite, parallel(browserSync, startWatch));
