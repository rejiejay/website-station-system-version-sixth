
import http from './app/module/http-service'
import Websocket from './app/module/web-socket'

import configuration from './app/config/index'

const initial = async () => {
    await http.initWebLibrary()
    await http.initClient(configuration)
    await http.initServer(configuration)
    await Websocket.init(configuration)
}

initial()
