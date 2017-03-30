var gulp = require('gulp');
var scp = require('gulp-scp');
var notify = require('gulp-notify');
var rsync = require("rsyncwrapper");
var gutil = require('gulp-util');
var apidoc = require('gulp-apidoc');
var markdown = require('gulp-markdown');
var runSequence = require('run-sequence');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var github = require('gulp-github');
var git = require('gulp-git');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');

//npm install gulp-md-template

gulp.task('default', function() {
  // place code for your default task here
});


// --------------------------------------------------------------------------------
// Actualizar en produccion
// --------------------------------------------------------------------------------
gulp.task('pro', ['apidoc', 'gen-changelog', 'upload-app-pro', 'upload-locales-pro', 'upload-appjs-pro'], function() {
  console.log('Actualizado el entorno de producción!');
});

// --------------------------------------------------------------------------------
// Actualizar en demos
// --------------------------------------------------------------------------------
gulp.task('demos', ['upload-app-demos', 'upload-locales-demos', 'upload-appjs-demos'], function() {
  console.log('Actualizado el entorno de demos!');
});


// --------------------------------------------------------------------------------
// Actualizar en pre-produccion
// --------------------------------------------------------------------------------
gulp.task('pre', ['apidoc', 'gen-changelog', 'upload-app-pre', 'upload-locales-pre', 'upload-appjs-pre'], function() {
  console.log('Actualizado el entorno de pre-producción!');
});

// --------------------------------------------------------------------------------
// Actualizar en oficina
// --------------------------------------------------------------------------------
gulp.task('oficina', ['apidoc', 'gen-changelog', 'upload-app-oficina', 'upload-locales-oficina', 'upload-appjs-oficina'], function() {
  console.log('Actualizado el entorno de oficina!');
});


// --------------------------------------------------------------------------------
// Subir ficheros a pre-produccion
// --------------------------------------------------------------------------------
gulp.task('upload-app-pre', ['apidoc', 'gen-changelog'], function() {
  rsync({
    ssh: true,
    src: '/Users/Carlos/Workspace/Kyros/KyrosView/app',
    dest: 'root@192.168.28.248:/opt/pre/KyrosView_frontend/',
    recursive: true,
    syncDest: true,
    args: ['--verbose']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('upload-locales-pre', function() {
  rsync({
    ssh: true,
    src: '/Users/Carlos/Workspace/Kyros/KyrosView/locales',
    dest: 'root@192.168.28.248:/opt/pre/KyrosView_frontend/',
    recursive: true,
    syncDest: true,
    args: ['--verbose']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('upload-appjs-pre', function () {
    gulp.src('/Users/Carlos/Workspace/Kyros/KyrosView/app-pre.js')
        .pipe(scp({
            host: '192.168.28.248',
            user: 'root',
            port: 22,
            path: '/opt/pre/KyrosView_frontend'
        }));
});
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// Subir ficheros a produccion
// --------------------------------------------------------------------------------
gulp.task('upload-app-pro', ['apidoc', 'gen-changelog'], function() {
  rsync({
    ssh: true,
    src: '/Users/Carlos/Workspace/Kyros/KyrosView/app',
    dest: 'root@192.168.28.248:/opt/KyrosView_frontend/',
    recursive: true,
    syncDest: true,
    args: ['--verbose']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('upload-locales-pro', function() {
  rsync({
    ssh: true,
    src: '/Users/Carlos/Workspace/Kyros/KyrosView/locales',
    dest: 'root@192.168.28.248:/opt/KyrosView_frontend/',
    recursive: true,
    syncDest: true,
    args: ['--verbose']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('upload-appjs-pro', function () {
    gulp.src('/Users/Carlos/Workspace/Kyros/KyrosView/app.js')
        .pipe(scp({
            host: '192.168.28.248',
            user: 'root',
            port: 22,
            path: '/opt/KyrosView_frontend'
        }));
});


// --------------------------------------------------------------------------------
// Subir ficheros a demos
// --------------------------------------------------------------------------------
gulp.task('upload-app-demos', function() {
  rsync({
    ssh: true,
    src: '/Users/Carlos/Workspace/Kyros/KyrosView/app',
    dest: 'root@192.168.28.244:/opt/KyrosView_frontend/',
    recursive: true,
    syncDest: true,
    args: ['--verbose']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('upload-locales-demos', function() {
  rsync({
    ssh: true,
    src: '/Users/Carlos/Workspace/Kyros/KyrosView/locales',
    dest: 'root@192.168.28.244:/opt/KyrosView_frontend/',
    recursive: true,
    syncDest: true,
    args: ['--verbose']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('upload-appjs-demos', function () {
    gulp.src('/Users/Carlos/Workspace/Kyros/KyrosView/app.js')
        .pipe(scp({
            host: '192.168.28.244',
            user: 'root',
            port: 22,
            path: '/opt/KyrosView_frontend'
        }));
});

// --------------------------------------------------------------------------------
// Subir ficheros a maquina de oficina
// --------------------------------------------------------------------------------
gulp.task('upload-app-oficina', ['apidoc', 'gen-changelog'], function() {
  rsync({
    ssh: true,
    src: '/Users/Carlos/Workspace/Kyros/KyrosView/app',
    dest: 'root@172.26.30.20:/opt/KyrosView_frontend/',
    recursive: true,
    syncDest: true,
    args: ['--verbose']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('upload-locales-oficina', function() {
  rsync({
    ssh: true,
    src: '/Users/Carlos/Workspace/Kyros/KyrosView/locales',
    dest: 'root@172.26.30.20:/opt/KyrosView_frontend/',
    recursive: true,
    syncDest: true,
    args: ['--verbose']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('upload-appjs-oficina', function () {
    gulp.src('/Users/Carlos/Workspace/Kyros/KyrosView/app.js')
        .pipe(scp({
            host: '172.26.30.20',
            user: 'root',
            port: 22,
            path: '/opt/KyrosView_frontend'
        }));
});
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// Generacion del la apidoc
// --------------------------------------------------------------------------------
gulp.task('apidoc',function(done){
  apidoc({
      src: "/Users/Carlos/Workspace/Kyros/KyrosView/app/server/routes/",
        dest: "/Users/Carlos/Workspace/Kyros/KyrosView/app/public/apidoc/",
        debug: true,
        includeFilters: [ ".*\\.js$" ]
      },done);
});
// --------------------------------------------------------------------------------


// --------------------------------------------------------------------------------
// Generacion del changelog
// --------------------------------------------------------------------------------
gulp.task('gen-changelog', function () {
    return gulp.src('/Users/Carlos/Workspace/Kyros/KyrosView/CHANGELOG.md')
        .pipe(markdown())
        .pipe(gulp.dest('/Users/Carlos/Workspace/Kyros/KyrosView/app/public/changelog'))
        .pipe(gulp.src("/Users/Carlos/Workspace/Kyros/KyrosView/app/public/changelog/CHANGELOG.html"));

});

gulp.task('rename-changelog', ['gen-changelog'], function () {
  // rename via string 
  gulp.src("/Users/Carlos/Workspace/Kyros/KyrosView/app/public/changelog/CHANGELOG.html")
    .pipe(rename("index.html"))
    .pipe(gulp.dest("/Users/Carlos/Workspace/Kyros/KyrosView/app/public/changelog/"))
    .pipe(notify("Tarea changelog finalizada !"));  
});

gulp.task('changelog', ['gen-changelog', 'rename-changelog']);
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// Sincronizar a github
// --------------------------------------------------------------------------------
gulp.task('github', ['sync-github-dirapp', 'sync-github-appjs']);

gulp.task('sync-github-dirapp', function() {
  rsync({
    ssh: true,
    src: '/Users/Carlos/Workspace/Kyros/KyrosView/app',
    dest: '/Users/Carlos/Workspace/github/KyrosView_frontend',
    recursive: true,
    syncDest: true,
    args: ['--verbose']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('sync-github-appjs', function() {
    return gulp.src('/Users/Carlos/Workspace/Kyros/KyrosView/app.js')
        .pipe(gulp.dest('/Users/Carlos/Workspace/github/KyrosView_frontend'));
});



gulp.task('github-commit', function(){
  return gulp.src('/Users/Carlos/Workspace/github/KyrosView_frontend/*')
    .pipe(git.commit(undefined, {
      args: '-am "automatic commit with gulp"',
      disableMessageRequirement: true
    }));
});

// --------------------------------------------------------------------------------
// Minimizar
// --------------------------------------------------------------------------------


gulp.task('mincss', function () {
    gulp.src('/Users/Carlos/Workspace/Kyros/KyrosView/app/public/css/kyrosview/*.css')
        .pipe(concat('kyrosview_all.css'))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('/Users/Carlos/Workspace/Kyros/KyrosView/app/public/css/'));
});

gulp.task('minjs', function () {
  gulp.src('/Users/Carlos/Workspace/Kyros/KyrosView/app/public/js/kyrosview/*.js')
  .pipe(concat('kyrosview_all.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('/Users/Carlos/Workspace/Kyros/KyrosView/app/public/js/'))
});

gulp.task('minjsexternal', function () {
  gulp.src('/Users/Carlos/Workspace/Kyros/KyrosView/app/public/js/external/*.js')
  .pipe(concat('external_all.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('/Users/Carlos/Workspace/Kyros/KyrosView/app/public/js/'))
});

gulp.task('minjsfile', function () {
    gulp.src('/Users/Carlos/Workspace/Kyros/KyrosView/app/public/js/kyrosview/*.js')
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('/Users/Carlos/Workspace/Kyros/KyrosView/app/public/js/kyrosview'));
});

gulp.task('mincssfile', function () {
    gulp.src('/Users/Carlos/Workspace/Kyros/KyrosView/app/public/css/kyrosview/*.css')
        .pipe(concat('kyrosview_all.css'))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('/Users/Carlos/Workspace/Kyros/KyrosView/app/public/css/'));
});

