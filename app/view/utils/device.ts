const isMobile = () => {
    const ua = window.navigator.userAgent
    const agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPod']

    return agents.find(agent => 0 < ua.indexOf(agent));
}

const device = {
    isMobile
}

export default device
