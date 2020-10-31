const ServerHttp = {
    httpConstructResolve: () => { },

    init(configuration) {
        return new Promise(resolve => this.httpConstructResolve = resolve)
    }
}

export default ServerHttp
