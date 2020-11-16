import * as http from 'http'
import consequencer, { Consequencer } from './../../utils/consequencer'
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
    const resource = new this.ResourcesHandle(request, this.config)
    if (resource.isRender) return await resource.render(response)
    await resource.static(response)
}

const clientHttp = {
    ...utils,

    config: {},

    init,

    requestHandle,
}

export default clientHttp
