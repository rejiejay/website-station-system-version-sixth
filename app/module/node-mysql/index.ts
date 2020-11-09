/**
* module对外方法:
* 1. 所有 data-access-object 方法均对外开放
* 2. mysql服务初始化方法
*/
import NodeMysql from './node-mysql'
import Task from './data-access-object/task'

const openMySql = {
    init: () => NodeMysql.init(),
    ...Task
}

export default openMySql