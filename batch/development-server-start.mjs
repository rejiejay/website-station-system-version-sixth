/**
 * development server start
 * server 端会反复启动, 因为 gulp 会监听代码是否改变. 所以单独出来并且添加处理端口的启动和关闭.
 */
import http from './../build/app/module/http-service'
import configuration from './../build/app/config/index'

const server = await http.initServer(configuration)
await Websocket.init(server, configuration)

process.on('message', async message => {
    if (message === 'kill') {
        await http.killServer()
        process.send('kill-success')
    }
})