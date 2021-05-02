const gulp = require('gulp');
const gulpCleanCss = require('gulp-clean-css');
const gulpCleanDir = require('gulp-clean-dir')
const gulpConcat = require('gulp-concat');
const gulpHtmlMinify = require('gulp-html-minifier');
const gulpLess = require('gulp-less');
const gulpUglify = require('gulp-uglify');
const gulpYaml = require('gulp-yaml');
const path = require('path');
const { pipeline } = require('readable-stream');
const streamQueue = require('streamqueue');

const PROJECT_DIR = path.dirname(__filename);
const ASSETS_DIR = path.join(PROJECT_DIR, 'src', 'assets');
const BUILD_DIR = path.join(PROJECT_DIR, 'build');

const queue = streamQueue.bind(null, { objectMode: true });

const htmlConfig = {
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    ignoreCustomComments: [/Yandex\.Metrika counter/],
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeOptionalTags: true,
    sortAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
};

const build = gulp.parallel(
    function buildJs() {
        return pipeline(
            queue(
                pipeline(
                    queue(
                        gulp.src(path.join(ASSETS_DIR, 'libs', 'base', 'jquery-1.10.1.min.js')),
                        gulp.src(path.join(ASSETS_DIR, 'libs', 'base', 'jquery-cookie-1.0.min.js')),
                        gulp.src(path.join(ASSETS_DIR, 'libs', 'base', 'angular-1.1.5.min.js')),
                        pipeline(
                            queue(
                                gulp.src(path.join(ASSETS_DIR, 'libs', 'base', 'angular-1.1.5-locale_ru-ru.js')),
                                gulp.src(path.join(ASSETS_DIR, 'libs', 'galleria', 'galleria-1.2.9.js')),
                                gulp.src(path.join(
                                    ASSETS_DIR, 'libs', 'galleria',
                                    'themes', 'classic', 'galleria.classic.js'
                                ))
                            ),
                            gulpUglify()
                        )
                    ),
                    gulpConcat('_lib.min.js')
                ),
                pipeline(
                    queue(
                        gulp.src(path.join(ASSETS_DIR, 'app', 'ui.js')),
                        gulp.src(path.join(ASSETS_DIR, 'app', 'effects.js')),
                        gulp.src(path.join(ASSETS_DIR, 'app', 'data.js')),
                        gulp.src(path.join(ASSETS_DIR, 'app', 'ajax.js')),
                        gulp.src(path.join(ASSETS_DIR, 'app', 'controllers', 'app_controller.js')),
                        gulp.src(path.join(ASSETS_DIR, 'app', 'controllers', 'index_controller.js')),
                        gulp.src(path.join(ASSETS_DIR, 'app', 'controllers', 'about_us_controller.js')),
                        gulp.src(path.join(ASSETS_DIR, 'app', 'controllers', 'project_detail_controller.js')),
                        gulp.src(path.join(ASSETS_DIR, 'app', 'controllers', 'project_banner_controller.js')),
                        gulp.src(path.join(ASSETS_DIR, 'app', 'controllers', 'error_404_controller.js')),
                        gulp.src(path.join(ASSETS_DIR, 'app', 'app.js'))
                    ),
                    gulpUglify(),
                    gulpConcat('_app.min.js')
                )
            ),
            gulpConcat('bundle.js'),
            gulpCleanDir(path.join(BUILD_DIR, 'assets'), { ext: ['.js'] }),
            gulp.dest(path.join(BUILD_DIR, 'assets'))
        );
    },
    function buildCss() {
        return pipeline(
            queue(
                pipeline(
                    gulp.src(path.join(ASSETS_DIR, 'css', 'styles.less')),
                    gulpLess(),
                    gulpCleanCss()
                ),
                pipeline(
                    gulp.src(path.join(ASSETS_DIR, 'libs', 'galleria', 'themes', 'classic', 'galleria.classic.css')),
                    gulpCleanCss()
                )
            ),
            gulpConcat('bundle.css'),
            gulpCleanDir(path.join(BUILD_DIR, 'assets'), { ext: ['.css'] }),
            gulp.dest(path.join(BUILD_DIR, 'assets'))
        );
    },
    function copyProjectImages() {
        return pipeline(
            gulp.src(path.join(ASSETS_DIR, 'images', '*')),
            gulpCleanDir(path.join(BUILD_DIR, 'assets', 'images')),
            gulp.dest(path.join(BUILD_DIR, 'assets', 'images'))
        );
    },
    function copyGalleriaImages() {
        return pipeline(
            gulp.src([
                path.join(ASSETS_DIR, 'libs', 'galleria', 'themes', 'classic', '*.gif'),
                path.join(ASSETS_DIR, 'libs', 'galleria', 'themes', 'classic', '*.png')
            ]),
            gulpCleanDir(path.join(BUILD_DIR, 'assets'), { ext: ['.png', '.gif'] }),
            gulp.dest(path.join(BUILD_DIR, 'assets'))
        );
    },
    function copyMedia() {
        return pipeline(
            gulp.src(path.join(PROJECT_DIR, 'src', 'media', '**', '*')),
            gulpCleanDir(path.join(BUILD_DIR, 'media')),
            gulp.dest(path.join(BUILD_DIR, 'media'))
        );
    },
    function buildIndexHtml() {
        return pipeline(
            gulp.src(path.join(PROJECT_DIR, 'src', 'index.html')),
            gulpHtmlMinify(htmlConfig),
            gulpCleanDir(path.join(BUILD_DIR), { ext: ['.html'] }),
            gulp.dest(BUILD_DIR)
        );
    },
    function copyRootFiles() {
        return pipeline(
            gulp.src(path.join(PROJECT_DIR, 'src', 'root-files', '*')),
            gulpCleanDir(path.join(BUILD_DIR), { ext: ['.txt', '.ico', '.xml'] }),
            gulp.dest(BUILD_DIR)
        );
    },
    function buildPartials() {
        return pipeline(
            gulp.src(path.join(ASSETS_DIR, 'app', 'partials', '*')),
            gulpHtmlMinify(htmlConfig),
            gulpCleanDir(path.join(BUILD_DIR, 'assets', 'partials')),
            gulp.dest(path.join(BUILD_DIR, 'assets', 'partials'))
        );
    },
    function buildProjectHeaders() {
        return pipeline(
            queue(
                pipeline(
                    gulp.src(path.join(ASSETS_DIR, 'app', 'project-headers', '*.html')),
                    gulpHtmlMinify(htmlConfig)
                ),
                pipeline(
                    gulp.src(path.join(ASSETS_DIR, 'app', 'project-headers', '*.css')),
                    gulpCleanCss()
                )
            ),
            gulpCleanDir(path.join(BUILD_DIR, 'assets', 'project-headers')),
            gulp.dest(path.join(BUILD_DIR, 'assets', 'project-headers'))
        );
    },
    function buildData() {
        return pipeline(
            gulp.src(path.join(PROJECT_DIR, 'data', '*.yml')),
            gulpYaml(),
            gulpCleanDir(path.join(BUILD_DIR, 'data')),
            gulp.dest(path.join(BUILD_DIR, 'data'))
        );
    }
);

gulp.task('build', build);
gulp.task('default', build);

gulp.task('watch', gulp.series(
    build,
    function watchFiles() {
        gulp.watch(['src/*', 'src/**/*'], build);
    }
));
