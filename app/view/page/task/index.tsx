import * as React from 'react';
import { ReactDOMComponent } from './../../utils/render';
import Utils from './utils/entry';

class TaskFollowUpMobileLayout extends Utils {
    constructor(props: any) {
        super(props)

        this.state = {}
    }

    state

    fetchTest() {
    }

    render() {
        return <div>Hello World</div>
    }
}

class TaskFollowUpComputerLayout extends Utils {
    constructor(props) {
        super(props)

        this.state = {}
    }

    state

    render() {
        return <div>Hello World</div>
    }
}

const reactDOMComponent = new ReactDOMComponent(TaskFollowUpComputerLayout, TaskFollowUpMobileLayout)
reactDOMComponent.render()
