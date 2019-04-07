var gulp           = require('gulp'),
		sass           = require('gulp-sass'),
		browsersync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleancss       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		autoprefixer   = require('gulp-autoprefixer'),
		notify         = require("gulp-notify"),
		sourcemaps 		 = require('gulp-sourcemaps'),
		// Pug
		plumber 			 = require('gulp-plumber'),
		pug 					 = require('gulp-pug'),
		pugbem 				 = require('gulp-pugbem'),
		htmlbeautify 	 = require('gulp-html-beautify'),
		// SVG sprite
		svgstore 			 = require('gulp-svgstore'),
		svgmin 				 = require('gulp-svgmin'),
		cheerio 			 = require('gulp-cheerio'),
		path 					 = require('path');


// js libs
gulp.task('js-libs', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		// 'app/libs/owl.carousel/dist/owl.carousel.min.js',
		// 'app/libs/fancybox/dist/jquery.fancybox.min.js',
		'app/libs/inputmask/dist/min/jquery.inputmask.bundle.min.js',
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browsersync.stream());
});

// main js
gulp.task('main-min-js', function() {
	return gulp.src('app/js/main.js')
	.pipe(uglify())
	.pipe(rename('main.min.js'))
	.pipe(gulp.dest('app/js'))
	.pipe(browsersync.stream());
});

// css libs
gulp.task('css-libs', function() {
	return gulp.src([
		'app/libs/magnific-popup/dist/magnific-popup.css',
		// 'app/libs/owl.carousel/dist/assets/owl.carousel.min.css',
		// 'app/libs/fancybox/dist/jquery.fancybox.css',
	])
	.pipe(concat('libs.min.css'))
	.pipe(autoprefixer(['last 10 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
	.pipe(gulp.dest('app/css'))
	.pipe(browsersync.stream());
});

// main sass
gulp.task('sass', function() {
	return gulp.src('app/sass/main.sass')
	.pipe(sourcemaps.init())
	.pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError()))
	.pipe(rename('main.min.css'))
	.pipe(autoprefixer(['last 10 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('app/css'))
	.pipe(browsersync.stream());
});

// Pug + bem
pugbem.b = true;
gulp.task('pug', function() {
	return gulp.src('app/pug/pages/*.pug')
	.pipe(plumber({errorHandler: notify.onError()}))
	.pipe(pug({plugins: [pugbem]}))
	.pipe(htmlbeautify())
	.pipe(gulp.dest('app/'))
	.pipe(browsersync.stream());
});

// Browser sync
gulp.task('browser-sync', function() {
	browsersync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		open: true,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

// SVG sprite
gulp.task('svg-sprite', function () {
	return gulp
	.src('app/img/svg-sprite/*.svg')
	.pipe(svgmin(function (file) {
		var prefix = path.basename(file.relative, path.extname(file.relative));
		return {
			plugins: [{
				cleanupIDs: {
					prefix: prefix + '-',
					minify: false
				}
			}]
		};
	}))
	.pipe(cheerio({
		run: function ($) {
			$('[fill]').removeAttr('fill');
			$('[stroke]').removeAttr('stroke');
			$('[style]').removeAttr('style');
			$('[data-name]').removeAttr('data-name');
		},
		parserOptions: { xmlMode: true }
	}))
	.pipe(svgstore())
	.pipe(gulp.dest('app/img/'));
});

// Watch tasks
gulp.task('watch', function() {
	gulp.watch(['app/sass/**/*.sass','!app/sass/libs/libs.sass'], gulp.parallel('sass'));
	gulp.watch('app/sass/libs.sass', gulp.parallel('css-libs'));
	gulp.watch('app/pug/**/*.pug', gulp.parallel('pug'));
	gulp.watch('app/js/main.js').on('change', browsersync.reload);
	gulp.watch('app/img/svg-sprite/*.svg', gulp.parallel('svg-sprite'));
});

gulp.task('default', gulp.parallel('js-libs', 'css-libs', 'sass', 'pug', 'svg-sprite', 'browser-sync', 'watch'));