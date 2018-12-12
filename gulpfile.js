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
		pug 					 = require('gulp-pug');


// Libs concat & minify
gulp.task('js_libs', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/jquery.inputmask/jquery.inputmask.bundle.min.js',
		'app/libs/magnific-popup/jquery.magnific-popup.min.js',
		// 'app/libs/owl.carousel/owl.carousel.js',
		// 'app/libs/fancybox3/jquery.fancybox.min.js',
		// 'app/libs/fullpage.js/fullpage.js',
		// 'app/libs/Modernizr/modernizr.js',
		// 'app/libs/jquery-ui/jquery-ui.min.js',
		// 'app/libs/jQueryFormStyler/jquery.formstyler.min.js',
		// 'app/libs/jScroll_Pane/jquery.mousewheel.js',
		// 'app/libs/jScroll_Pane/jquery.jscrollpane.min.js',
		// add plugins
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browsersync.reload({ stream: true }))
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
	})
});

// main sass
gulp.task('sass', function() {
	return gulp.src('app/sass/[^_]*.sass')
	.pipe(sourcemaps.init())
	.pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError()))
	.pipe(rename('main.min.css'))
	.pipe(autoprefixer(['last 5 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('app/css'))
	.pipe(browsersync.reload( {stream: true} ))
});

// Libs sass
gulp.task('sass_libs', function() {
	return gulp.src('app/sass/libs.sass')
	.pipe(sass({ outputStyle: 'expand' }).on('error', notify.onError()))
	.pipe(rename('libs.min.css'))
	.pipe(autoprefixer(['last 5 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browsersync.reload( {stream: true} ))
});

gulp.task('pug', function() {
	return gulp.src('app/pug/pages/*.pug')
		.pipe(plumber())
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest('app/'))
		.pipe(browsersync.stream());
});

// Watch tasks
gulp.task('watch', ['sass', 'sass_libs', 'js_libs', 'pug', 'browser-sync'], function() {
	gulp.watch(['app/sass/**/*.sass','!app/sass/libs/libs.sass'], ['sass']);
	gulp.watch('gulpfile.js', ['js_libs']);
	gulp.watch('app/sass/libs.sass', ['sass_libs']);
	gulp.watch('app/js/main.js', browsersync.reload);
	gulp.watch('app/pug/**/*.pug', ['pug']);
});

gulp.task('default', ['watch']);