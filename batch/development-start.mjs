/**
 * development start
 */
import { fork } from 'child_process'

const buildInstance = fork('./gulp-typescript-build.mjs', [])
buildInstance.on('message', message => {
    const clientInstance = fork('./development-client-start.mjs', [])
    const serverInstance = fork('./development-server-start.mjs', [])

    if (message === 'build-success') {
        clientInstance.send('build-success')
        serverInstance.send('build-success')
    }

    if (message === 'build-restart') {
        serverInstance.send('build-restart')
    }
})