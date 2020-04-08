const fs = require('fs')
const path = require('path')
const StringParser = require('../core/stringParser/StringParser')

const stringParser = new StringParser()

const dirPath = path.join(__dirname, 'TablesSql')

const executeSqlQuery = (connection, query, values) => {
    return new Promise((resolve, reject) => {
        connection.query(query, [values], (error, results) => {
            if (error) reject(error)

            resolve(results)
        })
    })
}

class DBManager {

    constructor(conn) {
        this.connection = conn
    }

    async callSqlQuery(query, values = []) {
        try {
            const queryResult = await executeSqlQuery(this.connection, query, values)

            return queryResult
        } catch(error) {
            throw new Error(error)
        }
    }

    async showTables() {
        const normals = await this.callSqlQuery(`show tables;`)

        const noPlurals = normals.map(({ Tables_in_pet_db: table}) => {
            const isPlural = table.charAt(table.length - 1) === 's'
            return isPlural ? table.slice(0, table.length - 1) : table
        })

        return [normals, noPlurals]
    }

    async verifyRelations(entityObj) {
        const entityKeys = Object.keys(entityObj)
        const tables = await this.showTables()

        const relationTables = tables[0].filter((table, index) => (
            entityKeys.includes(tables[1][index])
        )).map(
            relation => relation.Tables_in_pet_db
        )

        const relationFields = entityKeys.filter(key => (
            tables[1].includes(key)
        ))

        if(relationTables.length) {
            let results = await relationTables.map(async (table, index) => {
                const relationField = relationFields[index]
                const sqlResult = await this.callSqlQuery(`
                    select * from ${table} where id = ${entityObj[relationField]}
                `)
                
                return sqlResult
            })

            results = await Promise.all(results)

            results = results.map(result => (
                stringParser.parseObj('snakeCaseToCamelCase', result)
            ))

            relationFields.forEach((field, index) => {
                entityObj[field] = results[index][0]
            })
        }

        return entityObj
    }

    insertTables() {
        let dirContent = fs.readdirSync(dirPath)

        dirContent = dirContent.filter(file => {
            const extension = file.split('.')[1]

            return extension == 'sql'
        })
        
        dirContent.forEach(fileName => {
            const sqlQuery = fs.readFileSync(`${dirPath}/${fileName}`, 'utf-8')

            this.callSqlQuery(sqlQuery)
        })
    }
}

module.exports = DBManager