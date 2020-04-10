const http = require('http')
const serverRunner = require('./core/server/serverRunner')
const connection = require('./database/createConnection')
const DBManager = require('./database/DBManager')
const port = 3100

const server = http.createServer(serverRunner)

server.listen(port, () => {
    connection.connect(err => {
        if(err) throw console.error(err)

        const dbManager = new DBManager(connection)
        dbManager.insertTables()
        console.log(`Server running | port ${port}`)
    })
})
