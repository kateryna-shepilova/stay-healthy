import gulp from 'gulp';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import plumber from 'gulp-plumber';
import webp from 'gulp-webp';
import uglify from 'gulp-uglify';
import htmlmin from 'gulp-htmlmin';
import concat from 'gulp-concat';
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';

const sassCompiler = gulpSass(sass);
const bs = browserSync.create();

// Paths
const paths = {
    scss: './src/scss/**/*.scss',
    css: './dist/css',
    images: './src/images/**/*.{jpg,jpeg,png}',
    svg: './src/images/**/*.svg',
    imagesDist: './dist/images',
    html: './src/**/*.html',
    htmlDist: './dist',
    js: './src/js/**/*.js',
    jsDist: './dist/js',
    fonts: './src/fonts/**/*',
    fontsDist: './dist/fonts',
};

// Clean Dist Folder
export const clean = () => deleteAsync(['./dist/**', '!./dist']);

// Compile SCSS to CSS
export const compileSCSS = () =>
    gulp.src(paths.scss)
        .pipe(plumber())
        .pipe(sassCompiler().on('error', sassCompiler.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.css))
        .pipe(bs.stream());

// Copy SVG files as-is
export const copySVG = () =>
    gulp.src(paths.svg)
        .pipe(gulp.dest(paths.imagesDist));

// Convert images to WebP format
export const convertToWebP = () =>
    gulp.src(paths.images, {encoding: false})
        .pipe(webp())
        .pipe(gulp.dest(paths.imagesDist));

// Copy Fonts
export const copyFonts = () =>
    gulp.src(paths.fonts, {encoding: false})
        .pipe(gulp.dest(paths.fontsDist));

// Combined task for images
export const processImages = gulp.series(copySVG, convertToWebP);

// Minify and Move HTML
export const processHTML = () =>
    gulp.src(paths.html)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest((file) => {
            // Place `index.html` in root, others in `dist`
            return file.basename === 'index.html' ? './' : paths.htmlDist;
        }))
        .pipe(bs.stream());

// Minify and Concatenate JS
export const processJS = () =>
    gulp.src(paths.js)
        .pipe(plumber())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.jsDist))
        .pipe(bs.stream());

// Serve Project with Browser-Sync
export const serve = () => {
    bs.init({
        server: {
            baseDir: './',
        },
        port: 3000,
        notify: false,
    });

    gulp.watch(paths.scss, compileSCSS);
    gulp.watch(paths.images, processImages).on('change', bs.reload);
    gulp.watch(paths.svg, copySVG).on('change', bs.reload);
    gulp.watch(paths.html, processHTML);
    gulp.watch(paths.js, processJS);
    gulp.watch(paths.fonts, copyFonts).on('change', bs.reload);
};

// Default Task
export default gulp.series(
    clean,
    gulp.parallel(compileSCSS, processImages, processHTML, processJS, copyFonts),
    serve
);
