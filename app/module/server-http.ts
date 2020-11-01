import * as http from 'http'
import consequencer from './../utils/consequencer'
import auth from './auth'

const ServerHttp = {
    httpConstructResolve: () => { },

    init(configuration) {
        const slef = this

        return new Promise(resolve => {
            const server = http.createServer(slef.requestHandle)
            server.listen(configuration.port, configuration.host, () => resolve())
        })
    },

    requestHandle: async function requestHandle(request, response) {
        const responseJsonHandle = data => {
            response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
            response.end(JSON.stringify(data))
        }
        const responseHandle = {
            json: responseJsonHandle,
            success: (data, message) => responseJsonHandle(consequencer.success(data, message)),
            failure: (message, result, data) => responseJsonHandle(consequencer.error(message, result, data))  
        }

        const controllerInstance = this.urlToMethod(request.url, request.method)
        if (controllerInstance.result !== 1) return responseHandle.json(controllerInstance)

        const parameter = utils.reqToParameter(request)
        const controller = controllerInstance.data
        if (!utils.isNeedAuth(request)) return controller({ ...parameter }, responseHandle, request)

        const authInstance = await auth.serverHttp(request)
        if (authInstance.result !== 1) return responseHandle.json(authInstance)
        const userId = authInstance.data
        controller({ ...parameter, userId }, responseHandle, request)
    }
}

const reqToParameter = (request) => {
    return {}
}
const isNeedAuth = (request) => false

const utils = {
    reqToParameter,
    isNeedAuth,
}

export default ServerHttp
