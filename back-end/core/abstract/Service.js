const DBManager = require('../../database/DBManager')
const connection = require('../../database/createConnection')
const StringParser = require('../stringParser/StringParser')

const stringParser = new StringParser()

class Service {

    dbManager = new DBManager(connection)

    constructor(entityTableName) {
        this.tableName = entityTableName
    }

    async getAll() {
        try {
            let getResult = await this.dbManager.callSqlQuery(`
                SELECT * FROM ${this.tableName};
            `)

            getResult = await this.parseManyResults(getResult)

            return getResult
        } catch(e) {
            console.error(e)
        }
    }

    async getOne(id) {
        try {
            let [ getResult ] = await this.dbManager.callSqlQuery(`
                SELECT * FROM ${this.tableName} WHERE id = ${id};
            `)

            getResult = await this.parseOneResult(getResult)

            return getResult
        } catch(e) {
            console.error(e)
        }
    }

    async postOne(toPostObject) {
        toPostObject.id && delete toPostObject.id
        const objectValues = Object.values(toPostObject)

        try {
            const postResult = await this.dbManager.callSqlQuery(`
                INSERT INTO ${this.tableName} VALUES (default, ?);
            `, objectValues)

            return this.getOne(postResult.insertId)
        } catch(e) {
            console.error(e)
        }
    }

    async putOne(toUpdateObject) {
        const { id } = toUpdateObject
        const query = stringParser.createUpdateQuery(this.tableName, toUpdateObject)
        
        try {
            const putResult = await this.dbManager.callSqlQuery(query, [id])

            if(putResult.affectedRows) {
                return this.getOne(id)
            }
        } catch(e) {
            console.error(e)
        }

        return null
    }

    async deleteOne(id) {
        try {
            const deleteResult = await this.dbManager.callSqlQuery(`
                DELETE FROM ${this.tableName} WHERE id = ?
            `, [id])

            return deleteResult
        } catch(e) {
            console.error(e)
        }
    }

    async parseOneResult(content) {
        if(content) {
            content = await this.dbManager.verifyRelations(content)

            content = stringParser.parseObj('snakeCaseToCamelCase', content)
        }

        return content
    }

    async parseManyResults(contents) {
        if(contents.length) {
            contents = await Promise.all(
                contents.map(async result => (
                    await this.dbManager.verifyRelations(result)
                ))
            )

            contents = contents.map(result => (
                stringParser.parseObj('snakeCaseToCamelCase', result)
            ))
        }

        return contents
    }

}

module.exports = Service