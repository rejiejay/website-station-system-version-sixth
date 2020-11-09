import mysql from 'mysql'
import consequencer from './../../utils/consequencer'

const NodeMysql = {
    instance: null,

    init: function init() {
        const slef = this
        this.instance = mysql.createConnection({
            host: 'localhost',
            user: 'me',
            password: 'secret',
            database: 'my_db'
        })

        return new Promise(resolve => {
            slef.instance.connect(err => {
                if (err) return resolve(consequencer.error(JSON.stringify(err)))
                resolve(consequencer.success())
            })
        })
    },

    close: function close() {
        this.instance.end()
    }
}

export default NodeMysql
