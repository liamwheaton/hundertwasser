var gulp         = require('gulp');                  // the main guy
var clone        = require('gulp-clone');            // used to fork a stream
var rename       = require('gulp-rename');           // rename files in a stream
var sass         = require('gulp-sass');             // turn stylus code into css
var plumber      = require('gulp-plumber');          // handle errors
var beautify     = require('gulp-cssbeautify');      // make files human readable
var sourcemap    = require('gulp-sourcemaps');       // write sourcemaps
var minifycss    = require('gulp-minify-css');       // minify css code
var autoprefix   = require('gulp-autoprefixer');     // prefix any css with low support
var combinemq    = require('gulp-combine-media-queries');       // prefix any css with low support
var jekyll       = require('gulp-jekyll');      	 // prefix any css with low support
var runSequence  = require('run-sequence');       	 // prefix any css with low support
var frontMatter = require('gulp-front-matter');

gulp.task('css', function(){
													  // prepare css code
	var stream = gulp.src('css/main.scss')   		  // grab our sass file
		.pipe(frontMatter({ 						  // optional configuration 
      		property: 'frontMatter', 				  // property added to file object 
      		remove: true 							  // should we remove front-matter header? 
      	}))
		.pipe(plumber())                              // stop syntax errors crashing the watch
	//	.pipe(sourcemap.init())                       // get ready to write a sourcemap
		.pipe(sass({includePaths: ['./_sass']}))
		.pipe(combinemq())                               // turn the sass into css
	//.pipe(sourcemap.write())                      // write the sourcemap
		.pipe(autoprefix('last 2 versions'))          // autoprefix the css code
		.pipe(minifycss())                            // minify it (removes the sourcemap)
	//	.pipe(sourcemap.write())                      // write the sourcemap
		.pipe(rename('main.css'))                // add .min to the filename
		.pipe(gulp.dest('_site/css/'));               // save it into the dist folder
	
	return stream;
});

 gulp.task('jekyll', function (gulpCallBack){
     var spawn = require('child_process').spawn;
     var jekyll = spawn('jekyll', ['build'], {stdio: 'inherit'});
 
     jekyll.on('exit', function(code) {
         gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: '+code);
     });
 });


gulp.task('watch', ['build'], function(){
	gulp.watch(['css/main.scss', '_sass/*.scss'], ['css']);   // watch for changes and run the css task
	gulp.watch(['*.{markdown,md}', '_layouts/*'], ['build']);
});

gulp.task('build', function(callback) {
  runSequence('jekyll',
              'css',
              callback);
});


gulp.task('default', ['build']);