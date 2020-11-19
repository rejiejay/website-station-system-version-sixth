import * as React from 'react';
import { ReactDOMComponent } from './../utils';

class WindowsComponent extends React.Component {
    constructor(props: any) {
        super(props)

        this.state = {}
    }

    state

    fetchTest() {
    }

    render() {
        return <div
            onClick={this.fetchTest}
        >Hello World</div>
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

const reactDOMComponent = new ReactDOMComponent(WindowsComponent, MobileComponent)
reactDOMComponent.render()