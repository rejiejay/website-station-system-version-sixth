/**
 * development client start
 * client 端直接启动即可, 因为 client 部分是不会进行改动的. 所以client start单独出来
 */
import http from './../build/app/module/http-service'
import configuration from './../build/app/config/index'

process.on('message', async message => {
    if (message === 'build-success') {
        await http.initWebLibrary()
        await http.initClient(configuration)
    }
})