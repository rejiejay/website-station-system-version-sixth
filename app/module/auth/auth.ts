import consequencer, { Consequencer } from './../../utils/consequencer'
import utils from './utils'

function serverHttp(request): Promise<Consequencer> {
    return new Promise(resolve => {
        resolve(consequencer.success())
    })
}

function webSocket(): Promise<Consequencer> {
    return new Promise(resolve => {
        resolve(consequencer.success())
    })
}

const auth = {
    ...utils,

    serverHttp,
    webSocket
}


export default auth
