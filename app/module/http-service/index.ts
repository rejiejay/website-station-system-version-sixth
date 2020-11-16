/**
* module对外方法:
* 1. 客户端服务初始化方法
* 2. 服务端服务初始化方法
*/
import client from './client-http'
import server from './server-http'

const openHttp = {
    initClient: config => client.init(config),
    initServer: config => server.init(config)
}

export default openHttp
