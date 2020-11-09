/**
* module对外方法:
* 1. socket服务初始化方法
* 2. socket对外 response 方法
*/
import websocket from './websocket'

const openWebSocket = {
    init: config => websocket.init(config),
    response: {
        all: (method, data) => { },
        user: (method, userId, data) => { }
    }
}

export default openWebSocket
