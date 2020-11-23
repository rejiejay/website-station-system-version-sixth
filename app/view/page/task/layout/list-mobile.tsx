import Utils from './../utils/list.jsx';
import { SwitchItemSizeButton, TaskList, TaskItem, Operation } from './../component/list.jsx';

export default class TaskListLayout extends Utils {
    constructor(props) {
        super(props)
        this.state = {}
    }

    state = {}

    render() {
        return <div className="task-list">
            <SwitchItemSizeButton></SwitchItemSizeButton>

            <TaskList>
                <TaskItem>
                    <Operation></Operation>
                </TaskItem>
            </TaskList>

            <Operation></Operation>
        </div>
    }
}
