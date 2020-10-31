const ClientHttp = {
    httpConstructResolve: () => { },

    init(configuration) {
        return new Promise(resolve => this.httpConstructResolve = resolve)
    }
}

export default ClientHttp
