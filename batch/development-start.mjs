/**
 * development start
 */
import { fork } from 'child_process'

const buildInstance = fork('./batch/gulp-typescript-build.mjs', [])
buildInstance.on('message', message => {
    const clientInstance = fork('./batch/development-client-start.mjs', [])
    const serverInstance = fork('./batch/development-server-start.mjs', [])

    if (message === 'build-success') {
        clientInstance.send('build-success')
        serverInstance.send('build-success')
    }

    if (message === 'build-restart') {
        serverInstance.send('build-restart')
    }
})