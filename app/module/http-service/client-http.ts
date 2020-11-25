import * as http from 'http'
import utils from './utils'

function init(config) {
    const slef = this
    this.config = config

    return new Promise(resolve => {
        const server = http.createServer(slef.requestHandle)
        server.listen(config.development.client.port, config.development.client.host, () => resolve())
    })
}

async function requestHandle(request, response) {
    const proxy = new this.WebProxyHandle(request, response, this.config)
    if (proxy.needProxy) return proxy.pass()

    const resource = new this.ResourcesHandle(request, response, this.config)
    if (resource.isRender) return await resource.render()

    await resource.static()
}

export const initWebLibrary = () => {
    //     const targetFolderPath = buildPath('./web/lib')
    //     const renderFolderPath = buildPath('./build/lib')
    //     return await copyDirectory(targetFolderPath, renderFolderPath);
}

const clientHttp = {
    ...utils,
    config: {},
    init,
    requestHandle,
    initWebLibrary
}

export default clientHttp
