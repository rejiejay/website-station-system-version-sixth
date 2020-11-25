/**
 * development client start
 * 生产环境理想状态: 1. 获取git代码 2. gulp-typescript-build 打包 3. 启动
 */
import { exec, fork } from 'child_process'

const build = () => {
    const buildInstance = fork('./gulp-typescript-build.mjs', [])
    buildInstance.on('message', message => {
        if (message === 'build-success') {
            console.log('gulp typescript build success')
            restart()
        }
    })
}

const restart = () => exec('pm2 restart all', [], (error, stdout, stderr) => {
    if (error) return console.error(`执行的错误: ${error}`);
    console.log('pm2 restart all', stdout)
})

const gitInit = () => exec('git pull', [], (error, stdout, stderr) => {
    if (error) return console.error(`执行的错误: ${error}`);
    build()
    console.log('git init success', stdout)
})

gitInit()