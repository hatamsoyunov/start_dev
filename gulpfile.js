const { watch, src, dest, parallel } = require('gulp'),
	sass = require('gulp-sass'),
	browsersync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	babel = require('gulp-babel'),
	cleancss = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	notify = require('gulp-notify'),
	sourcemaps = require('gulp-sourcemaps'),
	// Pug
	plumber = require('gulp-plumber'),
	pug = require('gulp-pug'),
	pugbem = require('gulp-pugbem'),
	prettyHtml = require('gulp-pretty-html'),
	// SVG sprite
	svgstore = require('gulp-svgstore'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	path = require('path');

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
		.pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
		.pipe(dest('app/css'))
		.pipe(browsersync.stream());
}

// main min js
function minJs() {
	return (
		src('app/js/main.js')
			.pipe(
				babel({
					presets: ['@babel/env'],
				})
			)
			// .pipe(uglify())
			.pipe(rename({ extname: '.min.js' }))
			.pipe(dest('app/js'))
			.pipe(browsersync.stream())
	);
}

// main sass
function css() {
	return (
		src('app/sass/main.sass')
			.pipe(sourcemaps.init())
			.pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError()))
			.pipe(autoprefixer(['last 10 versions']))
			// .pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
			// .pipe(rename({ extname: '.min.css' }))
			.pipe(sourcemaps.write('.'))
			.pipe(dest('app/css'))
			.pipe(browsersync.stream())
	);
}

// Pug + bem
pugbem.b = true;

function html() {
	return src('app/pug/pages/*.pug')
		.pipe(plumber({ errorHandler: notify.onError() }))
		.pipe(pug({ plugins: [pugbem] }))
		.pipe(
			prettyHtml({
				indent_size: 2,
				indent_with_tabs: true,
				unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br'],
				extra_liners: [],
			})
		)
		.pipe(dest('app/'))
		.pipe(browsersync.stream());
}

// Browser sync
function browserSync(cb) {
	browsersync.init({
		server: {
			baseDir: 'app',
		},
		notify: false,
		open: false,
	});
	cb();
}

// SVG sprite
function svgSprite() {
	return src('app/img/svg-sprite/*.svg')
		.pipe(
			svgmin(function(file) {
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
			})
		)
		.pipe(
			cheerio({
				run: function($) {
					$('[fill]').removeAttr('fill');
					$('[fill-opacity]').removeAttr('fill-opacity');
					$('[stroke]').removeAttr('stroke');
					$('[style]').removeAttr('style');
					$('[data-name]').removeAttr('data-name');
				},
				parserOptions: { xmlMode: true },
			})
		)
		.pipe(svgstore())
		.pipe(dest('app/img/'));
}

// watch files
watch(['app/sass/**/*.sass', '!app/sass/libs/libs.sass'], css);
watch('app/sass/libs.sass', cssLibs);
watch('app/pug/**/*.pug', html);
watch('app/js/main.js', minJs);
watch('app/img/svg-sprite/*.svg', svgSprite);

// Export tasks
exports.default = parallel(jsLibs, minJs, cssLibs, css, html, svgSprite, browserSync);
