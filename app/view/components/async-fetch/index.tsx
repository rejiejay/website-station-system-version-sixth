import consequencer, { Consequencer } from './../../../utils/consequencer'

// TEMP for DELE
const toast = { show: () => { }, destroy: () => { } }

let requestCacheStack = [] // 请求的堆栈

const waitStackInterval = requestStackId => new Promise(async resolve => {
    const checkIfResolve = () => {
        if (requestCacheStack[0] === requestStackId) return resolve() // 其他方法执行完毕，因为最底部的方法是我们当前的方法, 所以不需要等待
        toast.show()
        setTimeout(checkIfResolve, 1000)
    }

    setTimeout(checkIfResolve, 1000)
})

const asyncRequestHandle = (resolveRequest): any => new Promise(async resolve => {
    const requestStackId = new Date().getTime() // 表示堆栈的唯一标识
    // 控制反转, 因为执行完毕不是这个方法控制的, 所以将控制权反还回去
    const resolveRequestHandle = result => {
        // 执行完毕就将此方法从堆栈中清除出去
        requestCacheStack = requestCacheStack.filter(id => id !== requestStackId)
        toast.destroy()
        resolveRequest(result)
    }

    // 直接执行, 因为堆栈为空. 表示没有并发
    if (requestCacheStack.length === 0) {
        toast.show()
        requestCacheStack.push(requestStackId)
        return resolve(resolveRequestHandle)
    }

    // 阻塞, 因为堆栈不为空. 说明存在并发
    console.warn('并发请求')
    requestCacheStack.push(requestStackId) // 先推入堆栈
    await waitStackInterval(requestStackId) // 等待其他方法执行完毕
    resolve(resolveRequestHandle) // 开始执行
})

// TODO: 暂不处理
const authHandle = (parameter): Promise<Consequencer> => new Promise(async resolve => resolve(consequencer.success()))
// TODO: 暂不处理
const initHeaders = (): any => {}
const queryToUrl = (parameter) => {}

const requestGet = ({ url, parameter, options }) => new Promise(async resolve => {
    const resolveRequest = await asyncRequestHandle(resolve) // 等待异步的执行, 因为存在权限校验, 所以需要保持请求按照顺序执行

    const authInstance = await authHandle({ url, method: 'get', parameter })
    if (authInstance.result !== 1) return resolveRequest(authInstance)

    const headers = initHeaders()
    const query = queryToUrl(parameter)
    const hiddenError = options.hiddenError
    const notHandleResult = options.notHandleResult
    const responseHandle = value => {
        if (!value) return resolveRequest(consequencer.error('数据格式不正确, 数据为空!'))

        if (notHandleResult) return resolveRequest(value)

        if (value.result === 1) return resolveRequest(value)

        // 失败的情况
        // if (!hiddenError) AlertPopup(value.message || JSON.stringify(value))
        resolveRequest(value)
    }

    window.fetch(`${url}${query}`, { method: 'GET', headers })
        .then(
            response => response.json(),
            error => consequencer.error(error)
        )
        .then(
            value => responseHandle(value),
            error => resolveRequest(consequencer.error(error))
        )
        .catch(
            error => resolveRequest(consequencer.error(error))
        )
})

const requestPost = (url, parameter, options) => new Promise(async resolve => {
    const resolveRequest = await asyncRequestHandle(resolve) // 等待异步的执行, 因为存在权限校验, 所以需要保持请求按照顺序执行

    const authInstance = await authHandle({ url, method: 'post', parameter })
    if (authInstance.result !== 1) return resolveRequest(authInstance)

    const headers = initHeaders()
    const hiddenError = options.hiddenError
    const notHandleResult = options.notHandleResult
    const responseHandle = value => {
        if (!value) return resolveRequest(consequencer.error('数据格式不正确, 数据为空!'))

        if (notHandleResult) return resolveRequest(value)

        if (value.result === 1) return resolveRequest(value)

        // 失败的情况
        // if (!hiddenError) AlertPopup(value.message || JSON.stringify(value))
        resolveRequest(value)
    }

    window.fetch(url, { method: 'POST', headers, body: parameter })
        .then(
            response => response.json(),
            error => consequencer.error(error)
        )
        .then(
            value => responseHandle(value),
            error => resolveRequest(consequencer.error(error))
        )
        .catch(
            error => resolveRequest(consequencer.error(error))
        )
})

// TODO: 暂时不管
const reGetConfirm = () => new Promise(async resolve => { })

const fetch = {
    get: requestGet,
    post: requestPost,
    reGetConfirm
}

export default fetch
