/**
* module对外方法:
* 1. webSocket端权限认证化方法
* 2. 服务端权限认证化方法
*/
import auth from './auth'

const openAuth = {
    server: request => auth.serverHttp(request),
    webSocket: () => auth.webSocket()
}

export default openAuth
