import consequencer, { Consequencer } from './../../utils/consequencer'
import * as Path from 'path'
import * as fs from 'fs'

class ResourcesUtils {
    verifyFilePath(path): Consequencer {
        return consequencer.success()
    }

    response404Handle(response) {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.write("404 Not Found\n");
        response.end();
    }

    readStreamHandle = (locationPath, response) => {
        const fileName = Path.resolve(__dirname, locationPath)
        const extName = Path.extname(fileName).substr(1);
        if (fs.existsSync(fileName)) {
            const mineTypeMap = { html: 'text/html;charset=utf-8', htm: 'text/html;charset=utf-8', xml: "text/xml;charset=utf-8", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", css: "text/css;charset=utf-8", txt: "text/plain;charset=utf-8", mp3: "audio/mpeg", mp4: "video/mp4", ico: "image/x-icon", tif: "image/tiff", svg: "image/svg+xml", zip: "application/zip", ttf: "font/ttf", woff: "font/woff", woff2: "font/woff2" }
            if (mineTypeMap[extName]) {
                response.writeHead(200, { 'Content-Type': mineTypeMap[extName] });
            }
            fs.createReadStream(fileName).pipe(response)
        }
    }
}

class ResourcesHandle extends ResourcesUtils {
    constructor(request, config) {
        super()
        this.url = request.url
        const clientUrls = config.client.urls
        const isConfigured = clientUrls.some(url => request.url === url)
        if (isConfigured) {
            this.isRender = true
        } else {
            this.isStatic = true
        }
    }

    url = '/'
    isRender = false
    isStatic = false

    async render(response) {
        const isVerifyFailure = ['html', 'tsx', 'less'].some(async path => {
            const verifyInstance = await this.verifyFilePath(`./build/${this.url}/index.${path}`)
            return verifyInstance.result !== 1
        })

        if (isVerifyFailure) return this.response404Handle(response)


    }

    async static(response) {
        const verifyInstance = await this.verifyFilePath(`./build/${this.url}`)
        if (verifyInstance.result !== 1) return this.response404Handle(response)
        this.readStreamHandle(this.url, response)
    }
}

class ResponseHandle {
    constructor(response) {
        this.response = response
    }

    response

    responseJsonHandle(data) {
        this.response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
        this.response.end(JSON.stringify(data))
    }

    json(data) {
        return this.responseJsonHandle(data)
    }

    success(data, message) {
        return this.responseJsonHandle(consequencer.success(data, message))
    }

    failure(message, result, data) {
        return this.responseJsonHandle(consequencer.error(message, result, data))
    }
}

function reqToParameter(request) { }
function isNeedAuth(request, config) { }

const utils = {
    ResourcesHandle,
    ResponseHandle,
    reqToParameter,
    isNeedAuth
}

export default utils
