import Utils, { CONST } from './../utils/detail.jsx';
import { Modal, MobileInput, Operation } from './../component/detail.jsx';

export default class TaskDetail extends Utils {
    constructor(props) {
        super(props)
        this.state = {
            pageStatus: CONST.page_status.default,
            task: GlobalConst.TASK.DEFAULT,

            title: '',
            content: '',
            SMART: '', /** S= specific 、M= measurable 、A= attainable 、R= relevant 、T= time-bound */

            putoff: null,
        }

        this.nodeid = null // create timestamp
        this.parentid = null
        this.originalTask = GlobalConst.TASK.DEFAULT // for Edit
        this.taskResolvedHandle = () => { }
    }

    showAdd({ putoff, parentId }) {
        const self = this
        this.setState({ pageStatus: 'add' })

        return new Promise(resolve => self.taskResolvedHandle = resolve)
    }

    async showEdit(taskId) {
        this.setState({ pageStatus: 'edit' })
        await this.initTaskDetail(taskId)
        return new Promise(resolve => self.taskResolvedHandle = resolve)
    }

    render() {
        return <Modal
            visible={pageStatus !== 'hiden'}
            isFullScreen={true}
        >
            <div className="task-detail-modal">
                <MobileInput key='title'
                    value={title}
                    onChangeHandle={value => this.setState({ title: value })}
                    isTheme
                    isRequiredHighlight
                    title='简单描述/提问/归纳'
                    placeholder='what情景? + what动作/冲突/方案'
                />
                <MobileInput key='content'
                    value={content}
                    onChangeHandle={value => this.setState({ content: value })}
                    isAutoHeight
                    height={250}
                    title='得出什么做法?'
                    placeholder='做法1: (情景是啥?)是什么?为什么?怎么办?'
                ></MobileInput>
                <MobileInput key='specific'
                    value={specific}
                    onChangeHandle={value => this.setSMARTdata(value, 'specific')}
                    isAutoHeight
                    height={125}
                    title='任务具体内容?'
                    placeholder='任务是什么?为什么存在这个任务?有啥影响?'
                ></MobileInput>
                <MobileInput key='measurable'
                    value={measurable}
                    onChangeHandle={value => this.setSMARTdata(value, 'measurable')}
                    isAutoHeight
                    height={125}
                    title='任务完成标识?'
                    placeholder='完成的标识是什么?为什么就标志任务完成?'
                ></MobileInput>
                <MobileInput key='attainable'
                    value={attainable}
                    onChangeHandle={value => this.setSMARTdata(value, 'attainable')}
                    isAutoHeight
                    height={125}
                    title='任务是否可以实现?'
                    placeholder='为什么可以实现?为什么未来的自己所接受呢? 原因?'
                ></MobileInput>
                <MobileInput key='relevant'
                    value={relevant}
                    onChangeHandle={value => this.setSMARTdata(value, 'relevant')}
                    isAutoHeight
                    height={125}
                    title='任务和哪些需求相关?'
                    placeholder='physiological safety belongingness and love respect self-actualization needs、为什么和这个需求相关? 需求1?为什么?'
                ></MobileInput>
                <MobileInput key='timeBound'
                    value={timeBound}
                    onChangeHandle={value => this.setSMARTdata(value, 'timeBound')}
                    isAutoHeight
                    height={125}
                    title='明确的截止期限?'
                    placeholder='期限1： 是什么?为什么设定这个时间?'
                >{{
                    rightTopDiv: <div className='select-putoff'
                        onClick={this.putoffSelectHandle.bind(this)}
                    >{putoff ? this.putoffToDes.call(this) : '选择期限'}</div>
                }}</MobileInput>

                <Operation
                    leftButtonArray={[
                        {
                            key: 'cancel',
                            description: 'cancel',
                            fun: this.cancelHandle.bind(this)
                        }
                    ].filter(this.buttonFilter.bind(this))}
                    rightButtonArray={[
                        {
                            key: 'add',
                            description: 'add',
                            fun: this.addHandle.bind(this)
                        }, {
                            key: 'delete',
                            description: 'delete',
                            fun: this.deleteHandle.bind(this)
                        }, {
                            key: 'edit',
                            description: 'edit',
                            fun: this.editHandle.bind(this)
                        }, {
                            key: 'complete',
                            description: 'complete',
                            fun: this.completeHandle.bind(this)
                        }
                    ].filter(this.buttonFilter.bind(this))}
                />
            </div>
        </Modal>
    }
}
