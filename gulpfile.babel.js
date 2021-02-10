// const gulp = require('gulp');
//javacritp


import gulp from 'gulp'
import babel from 'gulp-babel'
import terser from 'gulp-terser'
//html
import htmlmin from 'gulp-htmlmin';
//css
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
//pug
import pug from 'gulp-pug'
//sass
import sass from 'gulp-sass';
//common
import concat from 'gulp-concat'
//clean css
import clean from 'gulp-purgecss'
//Caché bust
import cacheBust from 'gulp-cache-bust';
//Optimización imágenes
import imagemin from 'gulp-imagemin';
//Browser sync
import browserSync, { init as server, stream, reload } from 'browser-sync';
//Plumber
import plumber from 'gulp-plumber';
//Typescript
// import ts from 'gulp-typescript';

//variables/constantes
const production = true;
const cssPlugins = [cssnano(), autoprefixer()];

//---------------------------------babel
gulp.task('babel', ()=>{
    return gulp.src('./src/js/*.js')
    .pipe(plumber())
    .pipe(concat('scripts-min.js'))
    .pipe(babel({
        presets:['@babel/env']
    }))
    .pipe(terser())
    .pipe(gulp.dest('./public/js'))
})

//-----------------------------------htmlmin
gulp.task('html-min' , () => {
    return gulp.src('./src/*.html')
      .pipe(plumber())
      .pipe(
        htmlmin({
          collapseWhitespace: true,
          removeComments    : false//--cambio nota
        })
      )
      //****** */
      .pipe(cacheBust({
                type: 'timestamp'
              }))//---------------
      .pipe(gulp.dest('./public'));
  });
//--------------------------------------------css

 gulp.task('styles', () => {
    return gulp.src('./src/css/*.css')
      .pipe(plumber())
      .pipe(concat('main-min.css'))
      .pipe(postcss(cssPlugins))                
      .pipe(gulp.dest('./public/css'))
      .pipe(stream());
  }); 
  //--------------------------------------sass
  gulp.task('sass', () => {
    return gulp.src('./src/scss/style.scss')
      .pipe(plumber())
      .pipe(postcss(cssPlugins)) //ojo modificado
      .pipe(sass({
        outputStyle:'expanded'//nested/expanded/compact/compressed
      }))
        
      .pipe(gulp.dest('./public/css'))
      .pipe(stream());
  });

  //---------------------------------------purgecss
  //nota: se ejecuta solo gulp clean
  gulp.task('clean', () => {
    return gulp.src('./public/css/style.css ')//main-min.css
      .pipe(plumber())
      .pipe(
        clean({
          content: ['./public/*.html']
        })
      )
      .pipe(gulp.dest('./public/css'));
  });

  //---------------------------------------Pug
  gulp.task('views', () => {
    return gulp.src('./src/views/*.pug')
      .pipe(plumber())
      .pipe(pug({
          pretty: production ? false : true
        }))
      .pipe(cacheBust({
          type: 'timestamp'
        })
      )
      .pipe(gulp.dest('./public'));
      
  });
//-----------------------------------------imagemin
//nota: se ejecuta solo gulp clean
gulp.task('imgmin', () => {
  return gulp.src('./src/img/*')
       .pipe(plumber())
       .pipe(imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 30, progressive: true }),
        imagemin.optipng({ optimizationLevel: 1 })
      ])
    )
    .pipe(gulp.dest('./public/img'));
});
//-----------------------------------------typescript
// gulp.task('typescript', () => {
//   return gulp.src('src/ts/*.ts')
//     .pipe(ts({
//         noImplicitAny: true,
//         outFile: 'using-ts.js'
//       })
//     )
//     .pipe(gulp.dest('public/js'));
// });
//-----------------------------------------vigilantes
gulp.task('default', ()=>{   
  server({
    server: './public'
  });   
    gulp.watch('./src/*.html', gulp.series('html-min')).on('change', reload);
    gulp.watch('./src/css/*.css', gulp.series('styles'));    
    gulp.watch('./src/views/**/*.pug', gulp.series('views')).on('change', reload);    
    gulp.watch('./src/scss/**/*.scss', gulp.series('sass'))      
    gulp.watch('./src/js/*.js', gulp.series('babel')).on('change', reload);
    // gulp.watch('./src/ts/*.ts', gulp.series('typescript')).on('change', reload); 
    // gulp.watch('./src/views/md/**/*.md', () => gulp.start('views', server.reload))   
})
