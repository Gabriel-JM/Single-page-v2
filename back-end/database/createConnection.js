const mysql = require('../node_modules/mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'single_page_db'
})

module.exports = connection