import * as React from 'react';
import ReactDOM from 'react-dom';
import device from './device';

/**
* utils对外方法:
*/
export class ReactDOMComponent {
    constructor(WindowsComponent, MobileComponent) {
        this.WindowsComponent = WindowsComponent
        this.MobileComponent = MobileComponent
    }

    WindowsComponent
    MobileComponent

    render() {
        const isMobile = device.isMobile()
        window.onload = () => ReactDOM.render(isMobile ? <this.MobileComponent /> : <this.WindowsComponent />, document.body)
    }
}

const utils = {
    ReactDOMComponent
}

export default utils
