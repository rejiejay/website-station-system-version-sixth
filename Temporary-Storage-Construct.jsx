/**
 * 临时存储, 因为目标是存储代码, 这个文件将会删除
 */
import mysql from 'mysql' // https://github.com/mysqljs/mysql

const utils = {
    onMessage: instance => { },
    createRandomString: parameter => { },
    urlToMethod: parameter => { }
}

// for common use, because 2 place have use it
const http = {
    createServer: () => { }
}

/** module/websocket.ts = '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------' */

const UIWebsocketHandle = message => {
}
const instanceToHandle = ({ instance }) => {
    const responseJsonHandle = data => instance.send(JSON.stringify(data))
    const responseHandle = {
        json: responseJsonHandle,
        success: (data, message) => responseJsonHandle(consequencer.success(data, message)),
        failure: (message, result, data) => responseJsonHandle(consequencer.error(message, result, data))
    }

    return responseHandle
}
const Websocket = {
    instance: null,
    pools: [],
    init: function init(config) {
        const slef = this

        return new Promise(resolve => {
            const wss = new WebSocket.Server(config, () => resolve())
            slef.instance = wss
            wss.on('connection', slef.connection)
        })
    },

    getPool: function getPool(instanceId) {
        const pool = this.pools.find(({ id }) => instanceId === id)

        return pool.instance
    },

    incomingHandle: function incomingHandle(instanceId, message) {
        const responseHandle = instanceToHandle({ instance: this.getPool(instanceId) })

        const formatInstance = utils.messageToFormat(message)
        if (formatInstance.result !== 1) return responseHandle.json(formatInstance)

        const { controller, parameter, token } = formatInstance.data

        const authInstance = await this.authWebsocketHttp(token)
        if (authInstance.result !== 1) return responseHandle.json(authInstance)

        const userId = authInstance.data
        controller({ ...parameter, userId }, responseHandle)
    },

    closeHandle: function closeHandle(instanceId, code, reason) {
        const filterPools = this.pools.filter(({ id }) => instanceId !== id)
        this.pools = filterPools
    },

    connection: function connection(instance) {
        const slef = this
        const instanceId = utils.createRandomString({ length: 16 })
        instance.on('message', message => slef.incomingHandle(instanceId, message))
        instance.on('close', (code, reason) => slef.closeHandle(instanceId, code, reason))
        this.pools.push({
            id: instanceId,
            instance,
        })
    },

    authWebsocketHttp: function authWebsocketHttp(token) {
        const decryptTokenInstance = utils.decryptToken(token)
        if (decryptTokenInstance.result !== 1) return decryptTokenInstance
    },
}


/** module/server-http.ts = '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------' */

const ServerHttp = {
    init: function init(config) {
        const slef = this

        return new Promise(resolve => {
            const server = http.createServer(slef.requestHandle)
            server.listen(config.port, config.host, () => resolve())
        })
    },

    requestHandle: async function requestHandle(request, response) {
        const responseJsonHandle = data => {
            response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
            response.end(JSON.stringify(consequencer.success(data, message)))
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

        const authInstance = await authServerHttp(request)
        if (authInstance.result !== 1) return responseHandle.json(authInstance)
        const userId = authInstance.data
        controller({ ...parameter, userId }, responseHandle, request)
    },

    urlToMethod: function urlToMethod(url, method) {
        const pathname = utils.urlToPathname(url)
        const controllerName = utils.controllerConversion(pathname, method) // ${method}_${pathname}_${pathname}_${pathname}
        const controller = controller[controllerName]
        if (controller) return consequencer.success(controller)
        return consequencer.error('can`t not find this request url')
    }
}


/** module/client-http.ts = '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------' */

const ClientHttp = {
    init: function init(config) {
        const slef = this

        return new Promise(resolve => {
            const server = http.createServer(slef.requestHandle)
            server.listen(config.port, config.host, () => resolve())
        })
    },

    requestHandle: function requestHandle(request, response) {
        const method = utils.urlToMethod(request.url)
        const parameter = utils.reqToParameter(request)
        const responseJsonHanle = data => {
            response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
            response.end(JSON.stringify(consequencer.success(data, message)))
        }
        const responseHanle = {
            json: responseJsonHanle,
            success: (data, message) => responseJsonHanle(consequencer.success(data, message)),
            failure: (message, result, data) => responseJsonHanle(consequencer.error(message, result, data))
        }
        method(parameter, responseHanle)
    }
}


/** module/node-mysql.ts = '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------' */

const NodeMysql = {
    instance: null,

    init: function init() {
        const slef = this
        this.instance = mysql.createConnection({
            host: 'localhost',
            user: 'me',
            password: 'secret',
            database: 'my_db'
        })

        return new Promise(resolve => {
            slef.instance.connect(err => {
                if (err) return resolve(consequencer.error(JSON.stringify(err)))
                resolve(consequencer.success())
            })
        })
    },

    close: function close() {
        this.instance.end()
    }
}


/** service/authorization.ts = '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------' */

const authorization = {
    get_auth_expire: (parameter, responseHanle, request) => {
        const decryptTokenInstance = getAuthToken(request)
        if (decryptTokenInstance.result !== 1) return responseHanle.json(decryptTokenInstance)

        const userInforInstance = NodeMysql.getUserInfor(userId)
        if (userInforInstance.result !== 1) return responseHanle.json(userInforInstance)

        const { appSecret } = storage.getSecret()
        const { userId } = decryptTokenInstance.data
        const token = utils.encrypToken(appSecret, userId)

        responseHanle.success(token)
    },

    post_auth_login: (parameter, responseHanle) => {
        const loginParameterInstance = utils.checkLogin(parameter)
        if (loginParameterInstance.result !== 1) return responseHanle.json(loginParameterInstance)

        const { userName, password } = loginParameterInstance.data
        const userInforInstance = NodeMysql.getUserId({ userName, password })
        if (userInforInstance.result !== 1) return responseHanle.json(userInforInstance)

        const { userId } = userInforInstance.data
        const { appSecret } = storage.getSecret()
        const token = utils.encrypToken(appSecret, userId)

        responseHanle.success(token)
    }
}


/** controller/hello.ts = '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------' */

const get_hello = (parameter, responseHanle) => {
    responseHanle.success('hello world!')
}


/** auth/websocket.ts = '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------' */



/** auth/server.ts = '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------' */

const aesEncrypt = ({ key, data }) => {
    const cipher = crypto.createCipher('aes192', key)
    return cipher.update(data, 'hex', 'utf8') + cipher.final('hex')
}
const aesDecrypt = ({ key, encrypted }) => {
    const cipher = crypto.createCipher('aes192', key)
    return cipher.update(data, 'hex', 'utf8') + cipher.final('hex')
}
const encrypSignature = (parameter = {}, pathname, method, token) => {
    const method_pathname = utils.methodPathConversion(pathname, method) // ${method}_${pathname}_${pathname}_${pathname}
    const parameterStr = utils.splitFill(JSON.stringify(parameter)) // {a:1}777777 = length === 6
    const key = method_pathname + parameterStr

    const signature = aesEncrypt({ key, data: token })
    return `${parameterStr[3]}${signature}`
}
const decryptSignature = (signature, method_pathname, parameter) => {
    const parameterStr = utils.splitFill(JSON.stringify(parameter)) // {a:1}777777 = length === 6
    const key = method_pathname + parameterStr
    if (signature[0] !== parameterStr[3]) return consequencer.error()

    const encrypted = signature.substr(1)
    const token = aesDecrypt({ key, encrypted })
    return consequencer.success(token)
}
const encrypToken = (secret, userId) => {
    const secretMD5 = '5ebe2294ecd0e0f08eab7690d2a6ee69' // 字符串 secret 32位 小写	
    const userIdSHA1 = 'db36668fa9a19fde5c9676518f9e86c17cabf65a' // 字符串	userId
    const key = `MD5=${secretMD5}SHA1=${userIdSHA1}`
    const data = { secret, userId }
    const token = aesEncrypt({ key, data })
    return `${secretMD5}${token}${userIdSHA1}`
}
const decryptToken = token => {
    const secretMD5 = '5ebe2294ecd0e0f08eab7690d2a6ee69' // 字符串 secret 32位 小写	
    const userIdSHA1 = 'db36668fa9a19fde5c9676518f9e86c17cabf65a' // 字符串	userId
    const key = `MD5=${secretMD5}SHA1=${userIdSHA1}`

    if (token.indexOf(secretMD5) === -1 || token.indexOf(userIdSHA1) === -1) return consequencer.error()

    const encrypted = token.slice(secretMD5.length, token.length - userIdSHA1.length)
    const { secret, userId } = aesDecrypt({ key, encrypted })
    return consequencer.success({ decrypSecret: secret, userId })
}
const getAuthToken = request => {
    const signature = request.headers.authorization
    const method_pathname = utils.methodPathConversion(request)
    const parameter = utils.parameterConversion(request)
    const decryptSignatureInstance = utils.decryptSignature(signature, method_pathname, parameter)
    if (decryptSignatureInstance.result !== 1) return decryptSignatureInstance

    const token = decryptSignatureInstance.data
    const decryptTokenInstance = utils.decryptToken(token)
    return decryptTokenInstance
}
/**
 * UI加密: UI是可以生成signature签名, 因为服务端是可以对称进行解密. 这样可以保证每次的签名是不一致的.
 *   UI-token: UI加密凭证, 因为凭证是通过用户名和密码获取的, 所以这些在UI只能存在大脑里
 *   UI-pathname+method: 用于保证每次的签名不一致
 *   UI-parameter: 用于保证每次的签名不一致
 * 服务端解析: 服务端需要解析2次, 因为是授权校验的步骤是不操作数据库的、
 *   signature签名解析：第一次是解析signature签名获取凭证Token，因为每次的签名不一致
 *   token验凭解析：
 *     token验凭证正确和过期，因为Token加密和解析就只有服务端才知道.其他人不可能瞎猫碰倒死耗子, 这个概率对于解析2次的人来说是很低的. 所以只要解析成功就默认是正确的.
 *     UI是无法解析token验凭, 因为UI不需要也不能够知道这些信息.
 * token凭证过期: 过期是为了防止被拿去乱使用, 所以需要通知UI去重新操作“过期授权流程”，因为“过期授权流程”就只有UI部分才知道如何操作
 * token验凭解析动态密匙：因为过期时间是服务端所设定的, 所以统一设置过期时间和密钥就可以作为凭证的校验. 只要过期就不需要去校验token是否正确了, 因为校验方式也发生了改变.
 */
const authServerHttp = request => {
    const decryptTokenInstance = getAuthToken(request)
    if (decryptTokenInstance.result !== 1) return decryptTokenInstance

    const { decrypSecret, userId } = decryptTokenInstance.data
    const { appSecret, isExpire } = storage.getSecret()

    if (isExpire) return consequencer.error('token is expire', tokenExpireCode) // ui to request expireAuth

    if (decrypSecret !== appSecret) return consequencer.error('token is error', tokenErrorCode)

    return consequencer.success(userId)
}


/** config/index.js = '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------' */

const config = {}


/** init.ts = '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------' */

const initial = async () => {
    await ServerHttp.init(config)
    await Websocket.init(config)
    await ClientHttp.init(config)
}

initial()
