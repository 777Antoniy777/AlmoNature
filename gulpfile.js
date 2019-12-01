"use strict";

var gulp = require("gulp");
var pug = require('gulp-pug');
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssmin = require("gulp-csso");
var rename = require("gulp-rename");
var image = require("gulp-image");
var webp = require("gulp-webp");
var objectfit = require(`postcss-object-fit-images`);
var jsconcat = require('gulp-concat');
var jsuglify = require("gulp-uglify");
var babel = require('gulp-babel');
var svgsprite = require('gulp-svg-sprite');
var sourcemaps = require(`gulp-sourcemaps`);
var del = require("del");
var server = require("browser-sync").create();

// css
gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      objectfit()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(cssmin())
    .pipe(rename("style.min.css"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

// js
gulp.task("js", function () {
  return gulp.src("source/js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(jsconcat("all.js"))
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(gulp.dest("build/js"))
    .pipe(jsuglify())
    .pipe(rename("all.min.js"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest("build/js"))
    .pipe(server.stream());
});

// img (jpg, png, svg, webp)
gulp.task("images", function() {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(image({
      pngquant: true,
      optipng: false,
      zopflipng: false,
      jpegRecompress: false,
      mozjpeg: ["-optimize", "-progressive"],
      guetzli: false,
      gifsicle: false,
      svgo: true,
      concurrent: 10,
      quiet: true
    }))
    .pipe(gulp.dest("source/img/"));
});

gulp.task("webp", function() {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({
      quality: 80
    }))
    .pipe(gulp.dest("source/img"));
});

gulp.task('sprite', function () {
  return gulp.src('source/img/icons-sprite/*.svg')
		.pipe(svgsprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
			}
		}))
		.pipe(gulp.dest('build/img/sprite/'));
});

// html
gulp.task("html", function() {
  return gulp.src("source/*.pug")
    .pipe(pug({}))
    .pipe(gulp.dest("build"));
});

gulp.task("server", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  // watchers
  gulp.watch("source/img/**/*.{png,jpg,webp}", gulp.series("copy")).on("change", server.reload);
  gulp.watch("source/img/icons-sprite/*.svg", gulp.series("sprite", "reload"));
  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/js/*/**.js", gulp.series("js"));
  gulp.watch("source/*.pug", gulp.series("html", "reload"));
});

gulp.task("reload", function(done) {
  server.reload();
  done();
});

gulp.task("copy", function() {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**/*.{png,jpg,webp}",
    "source/img/svg/*.svg"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("imagemin", gulp.series(
  "images",
  "webp",
));

gulp.task("build", gulp.series(
  "clean",
  "js",
  "sprite",
  "css",
  "copy",
  "html"
));

gulp.task("start", gulp.series(
  "build",
  "server"
));
