import * as React from 'react';
import utils from '../utils/index';

class WindowsComponent extends React.Component {
    constructor(props: any) {
        super(props)

        this.state = {}
    }

    state

    render() {
        return <div>Hello World</div>
    }
}

class MobileComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    state

    render() {
        return <div>Hello World</div>
    }
}

const reactDOMComponent = new utils.ReactDOMComponent(WindowsComponent, MobileComponent)
reactDOMComponent.render()
