const http = require('http')
const path = require('path')
const fs = require('fs')

const port = 8000

const server = http.createServer(async (req, res) => {
    const fileName = verifyUrl(req.url)
    const extension = fileName.split('.')[1]
    const filePath = path.join(__dirname, fileName)
    
    const mimeTypes = {
        txt: 'text/plain',
        html: 'text/html',
        css: 'text/css',
        xml: 'application/xml',
        js: 'application/javascript',
        ts: 'application/typescript',
        json: 'application/json',
        pdf: 'application/pdf',
        jpg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        svg: 'image/svg+xml',
        ico: 'image/x-icon',
        otf: 'font/otf',
        ttf: 'font/ttf'
    }

    const contentType = mimeTypes[extension] || 'application/octet-stream'

    const fileContent = await getFileContent(filePath)

    if(fileContent) {
        res.writeHead(200, { 'Content-Type': contentType })
        res.end(fileContent)
    }

    res.writeHead(200)
    res.end(await getFileContent(path.join(__dirname, 'index.html')))
})

server.listen(port, () => console.log('Front-end server on port: '+port))

function verifyUrl(url) {
    return url === '/' ? 'index.html' : url
}

async function getFileContent(path) {
    const result = await readFileContent(path)

    return await result
}

function readFileContent(path) {
    return new Promise(resolve => {
        if(fs.existsSync(path)) {
            resolve(fs.readFileSync(path))
        }
        resolve(null)
    })
}