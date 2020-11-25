import * as fs from 'fs';
import { projectRelativePath } from './../utils/path-handle';

const configuration = {
    version: JSON.parse(fs.readFileSync(projectRelativePath('./package.json')).toString()).version,

    development: {
        server: {
            url: '' // 服务地址
        },
        client: {
            port: '8080',
            host: '0.0.0.0',
            url: '', // 服务地址
            fetch: {
                profix: '' // 请求服务端的前缀
            }
        }
    },

    production: {}, // 不需要, 因为生产环境暂时用不上
}

export default configuration
