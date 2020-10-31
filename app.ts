
import ServerHttp from './app/module/server-http'
import ClientHttp from './app/module/client-http'
import Websocket from './app/module/web-socket'

import configuration from './app/config/index'

const initial = async () => {
    await ServerHttp.init(configuration)
    await ClientHttp.init(configuration)
    await Websocket.init(configuration)
}

initial()
