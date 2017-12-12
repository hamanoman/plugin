var gulp = require('gulp');
var plumber = require("gulp-plumber");
var rimraf = require('rimraf');
var fs = require('fs');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var rename = require('gulp-rename');

var jade = require('gulp-jade');
var data = require('gulp-data');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');

var babel = require('gulp-babel');
require('es6-promise').polyfill();
var uglify = require('gulp-uglify');

var tinyping = require('gulp-tinypng-compress');
// require('date-utils');

// =================================================================
// destパス
// =================================================================
var ROOT_PATH = '';
var ROOT_PATH_WORDPRESS = '';
var ASSETS_PATH = ROOT_PATH + 'assets/';
var SP_ROOT_PATH = '';
var SP_ASSETS_PATH = SP_ROOT_PATH + 'assets/sp/';
var TINYPNG_API_KEY = 'G664KCKm5pji9TaronxwvUMwa0w6uo0M'; //自分のものに書きかえる

// 各パスをオブジェクトでにまとめる
var path_to = {
  'html': ROOT_PATH,
  'php': ROOT_PATH_WORDPRESS,
  'css': ASSETS_PATH + 'css',
  'js': ASSETS_PATH + 'js',
  'images': ASSETS_PATH + 'images'
}
var sp_path_to = {
  'html': SP_ROOT_PATH,
  'css': SP_ASSETS_PATH + 'css',
  'js': SP_ASSETS_PATH + 'js',
  'images': SP_ASSETS_PATH + 'images'
}


var dirNum = 0;
// =================================================================
// HTML
// =================================================================
gulp.task('jade', function() {
  return gulp.src(['src/jade/**/*.jade', '!src/jade/**/include/*.jade'])
    .pipe(changed('src/jade/**/include/*.jade'))
    .pipe(data(function( file ) {
      // var setJade = require('./gulp/jade.js');
      var date = new Date();
      data_date = date.toFormat("YYYYMMDDHH24MISS");

      // return setJade(file);
    }))
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest( path_to.html ));
});

var templateTaskSet= [];
gulp.task('setTemplateTasks', function() {

  // ページ生成用JSONファイルの読み込み
  var jsonData = require('./src/data/test.json');

  var taskNumber = 0;

  // JSONのlength分だけタスクを生成
  for (var key in jsonData){
    (function(key) {
      gulp.task(jsonData[key].id, function(){
        return gulp.src('src/jade/single.jade')
          .pipe(plumber())
          .pipe(
            data(function( file ) {
              var return_data = {
                'testData': 'ここに渡したいデータを入れます',
                'testJson': jsonData[key]
              }

              return return_data;
            })
          )
          .pipe(jade({
            pretty: true
          }))
          .pipe(rename('template'+ jsonData[key].id +'.html'))
          .pipe(gulp.dest( path_to.html ));

          taskNumber++;
        });
    })(key);

    templateTaskSet.push(jsonData[key].id);
  }
  return
});
gulp.task('runTemplateTasks', templateTaskSet);
gulp.task('jade_multiple', function(cb) {
  runSequence('setTemplateTasks', 'runTemplateTasks', cb);
});



// =================================================================
// CSS
// =================================================================
gulp.task('sass',function(){
  return gulp.src(['src/scss/**/*.scss', '!_*.scss'])
    .pipe(changed('src/scss/**/*.scss'))
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest( path_to.css ));
});
gulp.task('autoprefixer', ['sass'], function () {
  return gulp.src( path_to.css + '/**/*.css' )
    .pipe(plumber())
    .pipe(autoprefixer({
      browsers: ['last 3 version', 'ie 8', 'ie 9', 'ie 10', 'last 3 iOS version', 'android >= 4.2'],
      cascade: false
    }))
    .pipe(gulp.dest( path_to.css ));
});
gulp.task('compress_css', ['autoprefixer'], function () {
  return gulp.src( path_to.css + '/**/*.css' )
    .pipe(cssmin())
    .pipe(gulp.dest( path_to.css ));
});
gulp.task('sass_sp',function(){
  return gulp.src(['src/sp/scss/**/*.scss', '!_*.scss'])
    .pipe(changed('src/sp/scss/**/*.scss'))
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest( sp_path_to.css ));
});
gulp.task('autoprefixer_sp', ['sass_sp'], function () {
  return gulp.src( sp_path_to.css + '/**/*.css' )
    .pipe(plumber())
    .pipe(autoprefixer({
      browsers: ['last 3 iOS version', 'android >= 4.1'],
      cascade: false
    }))
    .pipe(gulp.dest( sp_path_to.css ));
});
gulp.task('compress_css_sp', function () {
  return gulp.src( sp_path_to.css + '/**/*.css' )
    .pipe(cssmin())
    .pipe(gulp.dest( sp_path_to.css ));
});



// =================================================================
// JS
// =================================================================
gulp.task('babel',function(){
  return gulp.src(['src/babel/**/*.js'])
    .pipe(changed('src/babel/**/*.js'))
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest( path_to.js));
});
gulp.task('compress_js', ['babel'], function () {
  return gulp.src( path_to.js + '/**/*.js' )
    .pipe(uglify())
    .pipe(gulp.dest( path_to.js ));
});
gulp.task('babel_sp',function(){
  return gulp.src(['src/sp/babel/**/*.js'])
    .pipe(changed('src/sp/babel/**/*.js'))
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest( sp_path_to.js ));
});
gulp.task('compress_js_sp', function () {
  return gulp.src( sp_path_to.js + '/**/*.js' )
    .pipe(uglify())
    .pipe(gulp.dest( sp_path_to.js ));
});



// =================================================================
// 画像
// =================================================================
gulp.task( 'copy_image', function() {
  return gulp.src('public/userweb/images/**/*.{gif,png,jpg,jpeg}', { base: 'src/images' })
    .pipe(changed('public/userweb/images/**/*.{gif,png,jpg,jpeg}'))
    .pipe(gulp.dest( path_to.images));
});
gulp.task( 'copy_image_sp', function() {
  return gulp.src('public/smartphone/images/**/*.{gif,png,jpg,jpeg}', { base: 'src/sp/images' })
    .pipe(changed('public/smartphone/images/**/*.{gif,png,jpg,jpeg}'))
    .pipe(gulp.dest( sp_path_to.images));
});



// =================================================================
// watchの設定
// =================================================================
gulp.task('watch', function () {
  // pc
  // gulp.watch('src/jade/**', ['jade']);
  gulp.watch('src/scss/**', ['compress_css']);
  gulp.watch('src/babel/**', ['babel']);
});
gulp.task('default', ['watch']);



// =================================================================
// タスク
// =================================================================

// まとめてコンパイルタスク
gulp.task('compile', ['jade', 'compress_css', 'babel']);
