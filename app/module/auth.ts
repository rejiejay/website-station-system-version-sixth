import * as crypto from 'crypto'
import consequencer from './../utils/consequencer'

const aesEncrypt = ({ key, data }) => {
    const cipher = crypto.createCipher('aes192', key)
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
}
const aesDecrypt = ({ key, encrypted }) => {
    const cipher = crypto.createCipher('aes192', key)
    return cipher.update(encrypted, 'utf8', 'hex') + cipher.final('hex')
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
    if (signature[0] !== parameterStr[3]) return consequencer.error('')
    
    const encrypted = signature.substr(1)
    const token = aesDecrypt({ key, encrypted })
    return consequencer.success(token)
}
const encrypToken = (secret, userId) => {
    const secretMD5 = '5ebe2294ecd0e0f08eab7690d2a6ee69' // 字符串 secret 32位 小写	
    const userIdSHA1 = 'db36668fa9a19fde5c9676518f9e86c17cabf65a' // 字符串	userId
    const key = `MD5=${secretMD5}SHA1=${userIdSHA1}`
    const data = { secret, userId }
    const token =  aesEncrypt({ key, data })
    return `${secretMD5}${token}${userIdSHA1}`
}
const decryptToken = token => {
    const secretMD5 = '5ebe2294ecd0e0f08eab7690d2a6ee69' // 字符串 secret 32位 小写	
    const userIdSHA1 = 'db36668fa9a19fde5c9676518f9e86c17cabf65a' // 字符串	userId
    const key = `MD5=${secretMD5}SHA1=${userIdSHA1}`

    if (token.indexOf(secretMD5) === -1 || token.indexOf(userIdSHA1) === -1 ) return consequencer.error('')
    
    const encrypted = token.slice(secretMD5.length, token.length - userIdSHA1.length)
    const { secret, userId } = JSON.parse(aesDecrypt({ key, encrypted }))
    return consequencer.success({ decrypSecret: secret, userId })
}
const getAuthToken = request => {
    const signature = request.headers.authorization
    const method_pathname = utils.methodPathConversion(request.pathname, request.method)
    const parameter = utils.parameterConversion(request)
    const decryptSignatureInstance = utils.decryptSignature(signature, method_pathname, parameter)
    if (decryptSignatureInstance.result !== 1) return decryptSignatureInstance

    const token = decryptSignatureInstance.data
    const decryptTokenInstance = utils.decryptToken(token)
    return decryptTokenInstance
}

const utils = {
    aesEncrypt,
    aesDecrypt,
    encrypSignature,
    decryptSignature,
    encrypToken,
    decryptToken,
    getAuthToken,
    methodPathConversion: (pathname, method) => '',
    splitFill: (parameter) => '',
    parameterConversion: (request) => {}
}

const storage = {
    getSecret: () => ({appSecret: 1, isExpire: 2})
}
const CONST = {
    tokenExpireCode: 1,
    tokenErrorCode: 12
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
const serverHttp = async request => {
    const decryptTokenInstance = getAuthToken(request)
    if (decryptTokenInstance.result !== 1) return decryptTokenInstance

    const { decrypSecret, userId } = decryptTokenInstance.data
    const { appSecret, isExpire } = storage.getSecret()

    if (isExpire) return consequencer.error('token is expire', CONST.tokenExpireCode) // ui to request expireAuth

    if (decrypSecret !== appSecret) return consequencer.error('token is error', CONST.tokenErrorCode)

    return consequencer.success(userId)
}

const auth = {
    serverHttp
}

export default auth
