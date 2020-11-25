import * as WebSocket from 'ws'
import utils from './utils'

function init(server) {
    const slef = this

    return new Promise(resolve => {
        // https://github.com/theturtle32/WebSocket-Node
        const wss = new WebSocket.Server({ server })
        slef.instance = wss
        wss.on('connection', slef.connection)
        resolve()
    })
}

function getPool(instanceId) {
    const pool = this.pools.find(({ id }) => instanceId === id)

    return pool.instance
}

async function incomingHandle(instanceId, message) {
    const responseHandle = this.instanceToHandle({ instance: this.getPool(instanceId) })

    const formatInstance = this.messageToFormat(message)
    if (formatInstance.result !== 1) return responseHandle.json(formatInstance)

    const { controller, parameter, token } = formatInstance.data

    const authInstance = await this.authWebsocketHttp(token)
    if (authInstance.result !== 1) return responseHandle.json(authInstance)

    const userId = authInstance.data
    controller({ ...parameter, userId }, responseHandle)
}

function closeHandle(instanceId, code, reason) {
    const filterPools = this.pools.filter(({ id }) => instanceId !== id)
    this.pools = filterPools
}

function connection(instance) {
    const slef = this
    const instanceId = this.createRandomString({ length: 16 })
    instance.on('message', message => slef.incomingHandle(instanceId, message))
    instance.on('close', (code, reason) => slef.closeHandle(instanceId, code, reason))
    this.pools.push({
        id: instanceId,
        instance,
    })
}

function authWebsocketHttp(token) {
    const decryptTokenInstance = this.decryptToken(token)
    if (decryptTokenInstance.result !== 1) return decryptTokenInstance
}

const websocket = {
    ...utils,

    instance: null,

    pools: [],

    init,

    getPool,

    incomingHandle,

    closeHandle,

    connection,

    authWebsocketHttp
}


export default websocket
