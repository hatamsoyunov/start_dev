const { watch, src, dest, parallel } = require('gulp');
const	sass           = require('gulp-sass');
const	browsersync    = require('browser-sync');
const	concat         = require('gulp-concat');
const	uglify         = require('gulp-uglify');
const	cleancss       = require('gulp-clean-css');
const	rename         = require('gulp-rename');
const	autoprefixer   = require('gulp-autoprefixer');
const	notify         = require("gulp-notify");
const	sourcemaps 		 = require('gulp-sourcemaps');
// Pug
const	plumber 			 = require('gulp-plumber');
const	pug 					 = require('gulp-pug');
const	pugbem 				 = require('gulp-pugbem');
const	htmlbeautify 	 = require('gulp-html-beautify');
// SVG sprite
const	svgstore 			 = require('gulp-svgstore');
const	svgmin 				 = require('gulp-svgmin');
const	cheerio 			 = require('gulp-cheerio');
const	path 					 = require('path');


// js libs
function jsLibs() {
	return src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		// 'app/libs/owl.carousel/dist/owl.carousel.min.js',
		// 'app/libs/fancybox/dist/jquery.fancybox.min.js',
		'app/libs/inputmask/dist/min/jquery.inputmask.bundle.min.js',
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(dest('app/js'))
	.pipe(browsersync.stream());
}

// css libs
function cssLibs() {
	return src([
		'app/libs/magnific-popup/dist/magnific-popup.css',
		// 'app/libs/owl.carousel/dist/assets/owl.carousel.min.css',
		// 'app/libs/fancybox/dist/jquery.fancybox.css',
	])
	.pipe(concat('libs.min.css'))
	.pipe(autoprefixer(['last 10 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
	.pipe(dest('app/css'))
	.pipe(browsersync.stream());
}

// main min js
function minJs() {
	return src('app/js/main.js')
	.pipe(uglify())
	.pipe(rename({ extname: '.min.js' }))
	.pipe(dest('app/js'))
	.pipe(browsersync.stream());
}

// main sass
function css() {
	return src('app/sass/main.sass')
	.pipe(sourcemaps.init())
	.pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError()))
	.pipe(rename({ extname: '.min.css' }))
	.pipe(autoprefixer(['last 10 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
	.pipe(sourcemaps.write('.'))
	.pipe(dest('app/css'))
	.pipe(browsersync.stream());
}

// Pug + bem
pugbem.b = true;

function html() {
	return src('app/pug/pages/*.pug')
	.pipe(plumber({errorHandler: notify.onError()}))
	.pipe(pug({plugins: [pugbem]}))
	.pipe(htmlbeautify())
	.pipe(dest('app/'))
	.pipe(browsersync.stream());
}

// Browser sync
function browserSync(cb) {
	browsersync.init({
		server: {
			baseDir: "app"
		},
		notify: false,
		open: false
	});
	cb();
}

// SVG sprite
function svgSprite() {
	return src('app/img/svg-sprite/*.svg')
	.pipe(svgmin(function (file) {
		var prefix = path.basename(file.relative, path.extname(file.relative));
		return {
			plugins: [{
				cleanupIDs: {
					prefix: prefix + '-',
					minify: true
				}
			}]
		};
	}))
	.pipe(cheerio({
		run: function ($) {
			$('[fill]').removeAttr('fill');
			$('[fill-opacity]').removeAttr('fill-opacity');
			$('[stroke]').removeAttr('stroke');
			$('[style]').removeAttr('style');
			$('[data-name]').removeAttr('data-name');
		},
		parserOptions: { xmlMode: true }
	}))
	.pipe(svgstore())
	.pipe(dest('app/img/'));
}

// watchFiles
watch(['app/sass/**/*.sass','!app/sass/libs/libs.sass'], css);
watch('app/sass/libs.sass', cssLibs);
watch('app/pug/**/*.pug', html);
watch('app/js/main.js').on('change', browsersync.reload);
watch('app/img/svg-sprite/*.svg', svgSprite);

exports.minjs = minJs;
exports.default = parallel(jsLibs, cssLibs, css, html, browserSync);