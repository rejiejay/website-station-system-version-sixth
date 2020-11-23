import NodeMysql from './node-mysql'
import consequencer, { Consequencer } from './../../utils/consequencer'

class Base {
    constructor(table, dataAccessObject) {
        this.table = table
        this.format = dataAccessObject
    }

    table: ''

    format: {
        // key: {
        //     isRequired: false,
        //     type: 'string', // string number
        // }
    }

    query = (sql): Promise<Consequencer> => new Promise(resolve => {
        /**
         * @param {string} error https://github.com/mysqljs/mysql#error-handling
         * @param {string} results ?
         * @param {string} fields https://github.com/mysqljs/mysql#type-casting
         */
        NodeMysql.instance.query(sql, (error, results, fields) => {
            if (error) return resolve(consequencer.error(error.sqlMessage, error.errno));
            resolve(consequencer.success(results))
        });
    })

    verify(data) {
        const format = this.format
        let check = consequencer.success(data)
        Object.keys(format).forEach(key => {
            const myFormat = format[key]
            const value = data[key]
            if (myFormat.isRequired) {
                if (!value) check = consequencer.error(`${key} is required`)
                if (typeof value !== myFormat.type) check = consequencer.error(`${key} need ${myFormat.type}`)
            }
        })
        return check
    }

    dataToAddSql(data) {
        const keys = []
        const values = []
        Object.keys(data).forEach(key => {
            keys.push(key)
            values.push(data[key])
        })

        return `(${keys.join(',')}) VALUES (${values.join(',')})`
    }

    dataToUpdateSql(oldVal, newVal) {
        const sqls = []

        Object.keys(newVal).forEach(key => {
            if (newVal[key] !== oldVal[key]) sqls.push(`${key}=${newVal[key]}`)
        })

        return sqls.join(',')
    }

    find(id): Promise<Consequencer> {
        const self = this
        return new Promise(async resolve => {
            if (!id) return consequencer.error('id could not empty')
            const queryInstance = await self.query(`SELECT * FROM ${self.table} WHERE id=${id}`)
            if (queryInstance.result !== 1) return resolve(queryInstance)
            /**
             * 检测SQL数据是否正确
             * 因为暂且不知道查询出来的数据是怎样的结构
             */
            resolve(queryInstance)
        })
    }

    add(data) {
        const self = this
        return new Promise(async resolve => {
            const verifyInstance = self.verify(data)
            if (verifyInstance.result !== 1) return resolve(verifyInstance)

            const queryInstance = await self.query(`INSERT INTO ${self.table} ${self.dataToAddSql(data)}`)
            /**
             * 检测SQL数据是否正确
             * 因为暂且不知道查询出来的数据是怎样的结构
             */
            resolve(queryInstance)
        })
    }

    del(id) {
        const self = this
        return new Promise(async resolve => {
            const findInstance = await self.find(id)
            if (findInstance.result !== 1) return resolve(findInstance)

            const queryInstance = await self.query(`DELETE FROM ${self.table} WHERE id=${id}`)
            /**
             * 检测SQL数据是否正确
             * 因为暂且不知道查询出来的数据是怎样的结构
             */
            resolve(queryInstance)
        })
    }

    updata(id, data) {
        const self = this
        return new Promise(async resolve => {
            const verifyInstance = self.verify(data)
            if (verifyInstance.result !== 1) return resolve(verifyInstance)
            const findInstance = await self.find(id)
            if (findInstance.result !== 1) return resolve(findInstance)

            const queryInstance = await self.query(`UPDATE ${self.table} SET ${self.dataToUpdateSql(findInstance.data, data)} WHERE id=${id}`)
            /**
             * 检测SQL数据是否正确
             * 因为暂且不知道查询出来的数据是怎样的结构
             */
            resolve(queryInstance)
        })
    }
}

export default Base
