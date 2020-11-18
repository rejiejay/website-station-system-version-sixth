/**
* module对外方法:
* @initClient 客户端服务初始化方法
* @initWebLibrary 初始化web静态资源方法 -> 因为静态资源很少改动, 所以暴露出此方法提供给初始化或打包的流程
* @initServer 服务端服务初始化方法
*/
import client from './client-http'
import { initWebLibrary } from './utils'
import server from './server-http'

const openHttp = {
    initClient: config => client.init(config),
    initWebLibrary: initWebLibrary,
    initServer: config => server.init(config)
}

export default openHttp