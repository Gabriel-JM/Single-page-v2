const http = require('http')
const serverRunner = require('./core/server/serverRunner')
const port = 3100

const server = http.createServer(serverRunner)

server.listen(port, console.log(`Server running | port ${port}`))
