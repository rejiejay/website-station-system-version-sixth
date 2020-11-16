import * as http from 'http'
import consequencer, { Consequencer } from './../../utils/consequencer'
import auth from './../auth'
import Controller from './../../controller'
import utils from './utils'

function init(config) {
    const slef = this
    this.config = config

    return new Promise(resolve => {
        const server = http.createServer(slef.requestHandle)
        server.listen(config.port, config.host, () => resolve())
    })
}

async function requestHandle(request, response) {
    const responseHandle = new this.ResponseHandle(response)

    const controller = new Controller(request)

    const parameter = this.reqToParameter(request)
    if (!this.isNeedAuth(request, this.config)) return controller.request(parameter, responseHandle, request)

    const authInstance = await auth.serverHttp(request)
    if (authInstance.result !== 1) return responseHandle.json(authInstance)

    const userId = authInstance.data
    controller.request({ ...parameter, userId }, responseHandle, request)
}

const serverHttp = {
    ...utils,

    config: {},

    init,

    requestHandle,
}

export default serverHttp
