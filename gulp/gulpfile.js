var gulp = require('gulp');
var rsync = require('gulp-rsync');

gulp.task('default', function() {
  // place code for your default task here
});

 
gulp.task('deploy', function() {
  gulp.src('/Users/Carlos/Workspace/Varios/gulp2/a/**')
    .pipe(rsync({
      root: '/Users/Carlos/Workspace/Varios/gulp2/a/',
      username: 'root',
      hostname: '192.168.28.251',
      destination: '/root/a'
    }));
});