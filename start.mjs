import gulp from 'gulp'
import ts from 'gulp-typescript'
import { execFile } from 'child_process'

const tsProject = ts.createProject('tsconfig.json');

function init() {
    tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('build'))
        .on('end', () => {
            console.log('渲染完毕')
            execFile('start.bat', [], { cwd: 'D:/my-svn/website-station-system-version-sixth' }, (error, stdout, stderr) => {
                if (error) throw error
                console.log(stdout)
            })
        })
}

init()

/**
 * 重新渲染: 暂不实现, 因为比较复杂
 */
// gulp.watch(['app/*.ts', '!app/view/*.ts'], cb => {
//     console.log('重新渲染')
//     cb();
// });