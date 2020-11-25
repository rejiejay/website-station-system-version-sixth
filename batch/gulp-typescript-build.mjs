/**
 * gulp typescript build
 */
import gulp from 'gulp'
import ts from 'gulp-typescript'

const tsProject = ts.createProject('./../tsconfig.json');

const build = handle => tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('build'))
    .on('end', handle)

gulp.watch(['app/*.ts', '!app/view/*.ts'], cb => {
    build(() => {
        console.log('gulp-typescript-build-restart')
        process.send('build-restart')
    })
    cb()
});

build(() => {
    console.log('gulp-typescript-build-success')
    process.send('build-success')
})