import consequencer from './../../utils/consequencer'

const instanceToHandle = ({ instance }) => {
    const responseJsonHandle = data => instance.send(JSON.stringify(data))
    const responseHandle = {
        json: responseJsonHandle,
        success: (data, message) => responseJsonHandle(consequencer.success(data, message)),
        failure: (message, result, data) => responseJsonHandle(consequencer.error(message, result, data))
    }

    return responseHandle
}

const utils = {
    messageToFormat: (message) => { },
    createRandomString: ({ }) => { },
    decryptToken: (token) => { },

    instanceToHandle,
}

export default utils