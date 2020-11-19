import * as Path from 'path'
import * as fs from 'fs'
import gulp from 'gulp';
import less from 'gulp-less';
import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import LessPluginCleanCSS from 'less-plugin-clean-css';

import consequencer, { Consequencer } from './../../utils/consequencer'

interface ResponseHandleParame { message?: string, code?: number, contentType?: string }
class ResourcesUtils {
    response
    url = '/'
    isRender = false
    isStatic = false
    version = '6.0.0'
    isProduction = false

    // Need to check
    verifyFilePath(url): Consequencer {
        return fs.existsSync(url ? url : this.url) ? consequencer.success() : consequencer.error('The path not- exists')
    }

    responseHandle(parameter: ResponseHandleParame) {
        const { message, code, contentType } = parameter
        this.response.writeHead(code, { 'Content-Type': contentType ? contentType : 'text/plain' })
        this.response.write(message)
        this.response.end()
    }

    renderHyperTextMarkupLanguage = (): Promise<Consequencer> => new Promise(resolve => {
        const version = this.version
        const entryPath = this.url // TODO
        const outputPath = this.url // TODO

        const writeFile = content => fs.writeFile(outputPath, content, { encoding: 'utf8' }, writeFileError => resolve(writeFileError ? consequencer.error(JSON.stringify(writeFileError)) : consequencer.success(content)))

        const initVersion = content => {
            const contentVersion = content.replace(/<%=version%>/g, version)
            writeFile(contentVersion)
        }

        fs.readFile(entryPath, 'utf8', (readFileError, content) => {
            if (readFileError) return resolve(consequencer.error(JSON.stringify(readFileError)))
            initVersion(content)
        })
    })

    renderLeanerStyleSheets = (): Promise<Consequencer> => new Promise(resolve => {
        const isProduction = this.isProduction
        const entryPath = this.url // TODO
        const outputPath = this.url // TODO
        const cleanCSSPlugin = new LessPluginCleanCSS({ advanced: isProduction })

        gulp.src(entryPath)
            .pipe(less({
                paths: './css', // 环境路径
                plugins: [cleanCSSPlugin] /** 压缩 */
            }))
            .pipe(gulp.dest(outputPath))
            .on('error', error => resolve(consequencer.error(`转换 less 文件出错, 原因: ${error}`)))
            .on('end', () => resolve(consequencer.success()))
    })

    renderTypedJavaScriptXML = (): Promise<Consequencer> => new Promise(resolve => {
        const isProduction = this.isProduction
        const entryPath = this.url // TODO
        const outputPath = this.url // TODO
        const plugins = [new webpack.DefinePlugin({ 'process.env': isProduction ? '"production"' : '"development"' })]
        const uglifyJsPlugin = new UglifyJsPlugin({ sourceMap: true, extractComments: true })
        if (isProduction) plugins.push(uglifyJsPlugin)

        webpack({
            /**
             * cheap-module-eval-source-map: 每个模块使用 eval() 执行，并且 SourceMap 转换为 DataUrl 后添加到 eval() 中。初始化 SourceMap 时比较慢，但是会在重构建时提供很快的速度，并且生成实际的文件。行数能够正确映射，因为会映射到原始代码中。
             * eval-source-map: 不带列映射(column-map)的 SourceMap，将加载的 Source Map 简化为每行单独映射。
             */
            devtool: isProduction ? 'cheap-module-source-map' : 'cheap-module-eval-source-map', // 'source-map' 'inline-source-map' also works
            entry: [
                entryPath
            ],
            output: {
                publicPath: './',
                path: outputPath,
                filename: 'index.js'
            },
            resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
            module: {
                rules: [{
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loader: 'ts-loader'
                }]
            },
            externals: { react: 'React', 'react-dom': 'ReactDOM' },
            plugins
        }, (err, stats) => {
            if (err || stats.hasErrors()) return resolve(consequencer.error(stats.toJson().errors))
            return resolve(consequencer.success())
        });
    })
}

class ResourcesHandle extends ResourcesUtils {
    constructor(request, response, config, environment) {
        super()
        this.init(request, response, config, environment)
    }

    response
    url = '/'
    isRender = false
    isStatic = false
    version = '6.0.0'
    isProduction = false

    init(request, response, config, environment) {
        this.response = response
        this.url = request.url
        // 位置: getPackageJson().version import { getPackageJson } from './utils/file-handle.js';
        // 避免每次执行 getPackageJson 方法损耗性能，这方法仅仅只需要执行一次
        this.version = config.version
        if (environment && environment !== 'development') this.isProduction = true // js && css uglify plugin

        const clientUrls = config.client.urls
        const isConfigured = clientUrls.some(url => request.url === url) // Need to check
        isConfigured ? this.isRender = true : this.isStatic = true
    }

    async render() {
        const isVerifyFailure = ['html', 'tsx', 'less'].some(async path => {
            const verifyInstance = this.verifyFilePath(`./view/${this.url}/index.${path}`)
            return verifyInstance.result !== 1
        })

        if (isVerifyFailure) return this.responseHandle({ code: 404, message: '404 Not Found' })

        const tsxInstance = await this.renderTypedJavaScriptXML()
        if (tsxInstance.result !== 1) return this.responseHandle({ code: 200, message: tsxInstance.message })

        const lessInstance = await this.renderLeanerStyleSheets()
        if (lessInstance.result !== 1) return this.responseHandle({ code: 200, message: lessInstance.message })

        const htmlInstance = await this.renderHyperTextMarkupLanguage()
        if (htmlInstance.result !== 1) return this.responseHandle({ code: 200, message: htmlInstance.message })

        const html = htmlInstance.data
        return this.responseHandle({ code: 200, message: html, contentType: 'text/html;charset=utf-8' })
    }

    async static() {
        const mineTypeMap = { html: 'text/html;charset=utf-8', htm: 'text/html;charset=utf-8', xml: "text/xml;charset=utf-8", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", css: "text/css;charset=utf-8", txt: "text/plain;charset=utf-8", mp3: "audio/mpeg", mp4: "video/mp4", ico: "image/x-icon", tif: "image/tiff", svg: "image/svg+xml", zip: "application/zip", ttf: "font/ttf", woff: "font/woff", woff2: "font/woff2" }
        const outputPath = this.url // TODO

        const verifyInstance = await this.verifyFilePath(outputPath)
        if (verifyInstance.result !== 1) return this.responseHandle({ code: 404, message: '404 Not Found' })

        const fileName = Path.resolve(__dirname, outputPath)
        const extName = Path.extname(fileName).substr(1)
        if (mineTypeMap[extName]) this.response.writeHead(200, { 'Content-Type': mineTypeMap[extName] })
        fs.createReadStream(fileName).pipe(this.response)
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


export const initWebLibrary = () => {
    //     const targetFolderPath = buildPath('./web/lib')
    //     const renderFolderPath = buildPath('./build/lib')
    //     return await copyDirectory(targetFolderPath, renderFolderPath);
}

const utils = {
    ResourcesHandle,
    ResponseHandle,
    reqToParameter,
    isNeedAuth,
    initWebLibrary
}

export default utils
