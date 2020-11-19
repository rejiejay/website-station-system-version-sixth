import * as React from 'react';
import ReactDOM from 'react-dom';
import device from './device';

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

const render = {
    ReactDOMComponent
}

export default render
