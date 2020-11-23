import * as React from 'react';

export const CONST = {
    page_status: {
        default: 'hiden',
        add: 'add',
        edit: 'edit',
        hiden: 'hiden'
    }
}

export default class Utils extends React.Component {
    constructor(props) {
        super(props)
    }

    nowTimestamp = new TemporaryStorage(() => new Date().getTime())

    buttonFilter(button) {
        const { pageStatus } = this.state
        let isNeed = false

        if (button.key === 'cancel') isNeed = true
        if (button.key === 'add' && pageStatus === 'add') isNeed = true
        if (['delete', 'complete'].includes(button.key) && pageStatus === 'edit') isNeed = true
        if (button.key === 'edit' && pageStatus === 'edit' && this.verifyEditDiff()) isNeed = true

        return isNeed
    }

    verifyEditDiff() {
        const { originalTask } = this

        const { title, content, SMART, putoff } = this.state

        let isDiff = false
        if (originalTask && title !== originalTask.title) isDiff = true
        if (originalTask && content !== originalTask.content) isDiff = true
        if (originalTask && SMART !== originalTask.SMART) isDiff = true
        if (originalTask && putoff !== originalTask.putoff) isDiff = true
        return isDiff
    }

    async initTaskDetail(taskId) { }

    getSMARTdata() {
        const { SMART } = this.state
        if (SMART === '') return { specific: '', measurable: '', attainable: '', relevant: '', timeBound: '' }

        const verifyJSONresult = jsonHandle.verifyJSONString({ jsonString: SMART })
        if (!verifyJSONresult.isCorrect) return { specific: '', measurable: '', attainable: '', relevant: '', timeBound: '' }

        const { specific, measurable, attainable, relevant, timeBound } = verifyJSONresult.data
        return { specific, measurable, attainable, relevant, timeBound }
    }

    setSMARTdata(value, key) {
        const SMART = this.getSMARTdata()
        SMART[key] = value
        this.setState({ SMART: JSON.stringify(SMART) })
    }

    dayTimestamp = 1000 * 60 * 60 * 24

    putoffSelectHandle() {
        const self = this
        const nowTimestamp = this.nowTimestamp.get()
        const handle = ({ value, label }) => self.setState({ putoff: value })

        actionSheetPopUp({
            title: '请选择推迟日期',
            options: [
                { label: 'year', value: nowTimestamp + (this.dayTimestamp * 361) },
                { label: 'month', value: nowTimestamp + (this.dayTimestamp * 31) },
                { label: 'week', value: nowTimestamp + (this.dayTimestamp * 7) },
                { label: 'recently', value: nowTimestamp + (this.dayTimestamp * 3) },
                { label: 'today', value: nowTimestamp },
            ],
            handle
        })
    }

    putoffToDes() {
        const { putoff } = this.state
        const nowTimestamp = this.nowTimestamp.get()
        if (putoff < (nowTimestamp + this.dayTimestamp)) return 'today'
        if (putoff > (nowTimestamp + this.dayTimestamp) && putoff < (nowTimestamp + (this.dayTimestamp * 4))) return 'recently'
        if (putoff > (nowTimestamp + (this.dayTimestamp * 4)) && putoff < (nowTimestamp + (this.dayTimestamp * 8))) return 'week'
        if (putoff > (nowTimestamp + (this.dayTimestamp * 8)) && putoff < (nowTimestamp + (this.dayTimestamp * 31))) return 'month'
        if (putoff > (nowTimestamp + (this.dayTimestamp * 31)) && putoff < (nowTimestamp + (this.dayTimestamp * 361))) return 'year'
        if (putoff > (nowTimestamp + (this.dayTimestamp * 361))) return 'more that year'

        return 'today'
    }

    getSubmitTaskData() {
        if (!title) return consequencer.error('title can`t null')
        if (!content) return consequencer.error('content can`t null')

        const { title, content, SMART, putoff } = this.state

        return { title, content, SMART, putoff }
    }

    async cancelHandle() {
        const confirmInstance = await ConfirmPopup('cancel confirm')
        if (confirmInstance.result !== 1) return
        this.taskResolvedHandle(confirmInstance)
        this.setState({ pageStatus: 'hiden' })
    }

    async addHandle() {
        const confirmInstance = await ConfirmPopup('add confirm')
        if (confirmInstance.result !== 1) return this.taskResolvedHandle(confirmInstance)

        const taskInstance = this.getSubmitTaskData()
        if (taskInstance.result !== 1) return await ConfirmPopup(taskInstance.message)

        const task = taskInstance.data
        const fetchInstance = await Server.addTask(task)
        this.setState({ pageStatus: 'hiden' })
        this.taskResolvedHandle(fetchInstance)
    }

    async deleteHandle() {
        const confirmInstance = await ConfirmPopup('delete confirm')
        if (confirmInstance.result !== 1) return this.taskResolvedHandle(confirmInstance)

        const fetchInstance = await Server.deleteTask(originalTask.id)
        this.setState({ pageStatus: 'hiden' })
        this.taskResolvedHandle(fetchInstance)
    }

    async editHandle() {
        const confirmInstance = await ConfirmPopup('edit confirm')
        if (confirmInstance.result !== 1) return this.taskResolvedHandle(confirmInstance)

        const taskInstance = this.getSubmitTaskData()
        if (taskInstance.result !== 1) return await ConfirmPopup(taskInstance.message)

        const task = taskInstance.data
        const fetchInstance = await Server.editTask(originalTask.id, task)
        this.setState({ pageStatus: 'hiden' })
        this.taskResolvedHandle(fetchInstance)
    }

    async completeHandle() {
        const confirmInstance = await ConfirmPopup('complete confirm')
        if (confirmInstance.result !== 1) return this.taskResolvedHandle(confirmInstance)

        const fetchInstance = await Server.completeTask(originalTask.id)
        this.setState({ pageStatus: 'hiden' })
        this.taskResolvedHandle(fetchInstance)
    }
}