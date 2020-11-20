import * as http from 'http'
import utils from './utils'

function init(config) {
    const slef = this
    this.config = config

    return new Promise(resolve => {
        const server = http.createServer(slef.requestHandle)
        server.listen(config.client.port, config.client.host, () => resolve())
    })
}

async function requestHandle(request, response) {
    const proxy = new this.WebProxyHandle(request, response, this.config)
    if (proxy.needProxy) return proxy.pass()

    const resource = new this.ResourcesHandle(request, response, this.config)
    if (resource.isRender) return await resource.render()

    await resource.static()
}

const clientHttp = {
    ...utils,

    config: {},

    init,

    requestHandle,
}

export default clientHttp
