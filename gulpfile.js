var
	gulp = require('gulp'),
	clean = require('gulp-clean'),
	bower = require('main-bower-files'),
	filter = require('gulp-filter'),
	sass = require('gulp-sass'),
	cssmin = require('gulp-clean-css'),
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
	uglify = require('gulp-uglify'),
	watch = require('gulp-watch'),
	sequence = require('gulp-sequence'),
	plumber = require('gulp-plumber'),
	sourcemaps = require('gulp-sourcemaps'),
	jsoncombine = require('gulp-jsoncombine'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	compassImagehelper = require('gulp-compass-imagehelper');

var Paths = function (opt) {
	this.src = {
		root: opt.src,
		vendor: opt.vendor,
		js: opt.src + '/js',
		// mocks: opt.src + '/mocks',
		css: opt.src + '/scss',
		img: opt.src + '/img',
		// html: opt.src + '/templates',
		fonts: opt.src + '/fonts',
	};

	this.dest = {
		root: opt.dest,
		vendor: opt.dest + '/assets/vendor',
		js: opt.dest + '/assets/js',
		css: opt.dest + '/assets/css',
		img: opt.dest + '/assets',
		fonts: opt.dest + '/assets/fonts',
		// html: opt.dest,
	};
};


paths = new Paths({
	vendor: 'vendor',
	src: 'src',
	dest: 'build',
});

gulp.task('sprite', function () {
    return gulp.src('src/img/icons/*.+(jpeg|jpg|png|gif|svg)')
        .pipe(compassImagehelper({
            targetFile: 'scss/common/_sprite.scss',
            images_path: 'src/img/',
            css_path: 'assets/css/',
            prefix: 'icon-'
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('serve', function () {
	browserSync.init({
		server: "build"
	});
});

// gulp.task('vendor-ammap', function () {
// 	return gulp.src([paths.src.vendor + '/ammap3/ammap/**/*'])
// 		.pipe(gulp.dest(paths.dest.vendor + '/ammap'));
// });

// gulp.task('vendor-fancybox', function () {
// 	return gulp.src([paths.src.vendor + '/fancybox/source/**/*'])
// 		.pipe(gulp.dest(paths.dest.vendor + '/fancybox'));
// });

// gulp.task('jq-ui', function () {
// 	return gulp.src([paths.src.vendor + '/jquery-ui/jquery-ui.min.js'])
// 		.pipe(gulp.dest(paths.dest.vendor + '/jquery-ui'));
// });

// gulp.task('vendor', ['vendor-fancybox', 'vendor-ammap', 'jq-ui']);

gulp.task('sass', function () {
	return gulp.src([paths.src.css + '/**/*.scss'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 5 versions', 'ie >= 11', 'and_chr >= 4.4']
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.dest.css))
		.pipe(browserSync.stream());
});

// gulp.task('coffee', function () {
// 	return gulp.src(paths.src.js + '/**/*.coffee')
// 		.pipe(plumber())
// 		.pipe(sourcemaps.init())
// 		.pipe(coffee({bare: true}))
// 		.pipe(sourcemaps.write())
// 		.pipe(gulp.dest(paths.dest.js))
// 		.pipe(browserSync.stream());
// });

// gulp.task('mocks', function () {
// 	return gulp.src(paths.src.mocks + '/**/*.json')
// 		.pipe(jsoncombine('mocks.json', function (data) {
// 			return new Buffer(JSON.stringify(data, null, 2));
// 		}))
// 		.pipe(gulp.dest(paths.dest.root))
// 		.pipe(browserSync.stream());
// });

// gulp.task('pug', ['mocks'], function () {
// 	global._ = require('lodash');
// 	global.mocks = require('./' + paths.dest.root + '/mocks.json');

// 	return gulp.src(paths.src.html + '/**/!(_)*.pug')
// 		.pipe(plumber())
// 		.pipe(pug({
// 			pretty: true,
// 			globals: ['_', 'helpers', 'mocks'],
// 		}))
// 		.pipe(gulp.dest(paths.dest.html))
// 		.pipe(browserSync.stream());
// });

gulp.task('bower', function () {
	return gulp.src(paths.src.vendor)
		.pipe(filter('**/*.js'))
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest(paths.dest.js))
		.pipe(browserSync.stream());
});

gulp.task('img', function () {
	gulp.src(paths.src.img + '/favicon.ico')
		.pipe(gulp.dest(paths.dest.root));

	return gulp.src(paths.src.img + '/**/*')
		.pipe(gulp.dest(paths.dest.img + '/img'))
		.pipe(browserSync.stream());
});

gulp.task('fonts', function () {
	return gulp.src([paths.src.fonts + '/**/*', paths.src.vendor + '/font-awesome/fonts/**/*'])
		.pipe(gulp.dest(paths.dest.fonts))
		.pipe(browserSync.stream());
});

gulp.task('clean', function () {
	return gulp.src(paths.dest.root + "/assets", {read: false})
		.pipe(clean());
});

gulp.task('uglify', function () {
	return gulp.src(paths.dest.js + '/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(paths.dest.js));
});

gulp.task('cssmin', function () {
	return gulp.src(paths.dest.css + '/**/*.css')
		.pipe(cssmin())
		.pipe(gulp.dest(paths.dest.css));
});

gulp.task('autoprefixer', function () {
	return gulp.src(paths.dest.css + '/**/*.css')
		.pipe(autoprefixer({
			browsers: ['last 5 versions', 'ie >= 10', 'and_chr >= 4.4']
		}))
		.pipe(gulp.dest(paths.dest.css));
});

gulp.task('imagemin', function () {
	return gulp.src(paths.dest.img + '/**/*.*')
		.pipe(imagemin({
			optimizationLevel: 7,
			progressive: true,
			svgoPlugins: [
				{removeViewBox: false},
				{cleanupIDs: false},
			],
		}))
		.pipe(gulp.dest(paths.dest.img));
});

gulp.task('watch', function () {
	gulp.watch([paths.src.css + '/**/*.scss', paths.src.vendor + '/**/*.scss'], ['sass']);
	// gulp.watch(paths.src.html + '/**/*.pug', ['mocks', 'pug']);
	// gulp.watch(paths.src.js + '/**/*.coffee', ['coffee']);
	gulp.watch(paths.src.img + '/**/*', ['img']);
	// gulp.watch([paths.src.fonts + '/**/*', paths.src.vendor + '/font-awesome/fonts/**/*'], ['fonts']);
	gulp.watch(paths.src.vendor + '/**/*', ['bower']);
});

gulp.task('move-js', function() {
	return gulp.src(paths.src.js + '/**/*.js')
		.pipe(gulp.dest(paths.dest.js));
});

gulp.task('default', sequence('clean', ['sprite', 'sass', 'bower', 'fonts', 'move-js', 'img']));
gulp.task('dev', sequence('default', 'watch', 'serve'));
gulp.task('build', sequence('default', ['uglify', 'cssmin', 'imagemin']));
