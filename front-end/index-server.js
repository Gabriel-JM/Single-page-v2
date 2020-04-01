const http = require('http')
const path = require('path')
const fs = require('fs')

const port = 8000

const server = http.createServer(async (req, res) => {
    function notFound() {
        res.writeHead(400)
        res.end()
    }

    if(req.url === '/index-server.js') notFound()

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

    notFound()
})

server.listen(port, console.log('Front-end server on port: '+port))

function verifyUrl(url) {
    const verification = url === '/' || !isFileRequest(url)
    const indexPath = path.join('public', 'index.html')
    const parsedUrl = !verification ? adjustUrl(url) : url

    return verification ? indexPath : parsedUrl
}

function isFileRequest(url) {
    const regexs = [/\.([a-z]){1,4}/]
    return regexs.every(regex => RegExp(regex).test(url))
}

function adjustUrl(url) {
    if(!RegExp(/^src/).test(url)) {
        return `src${url.split('src')[1]}`
    }
}

async function getFileContent(path) {
    try {
        const result = await readFileContent(path)

        return await result
    } catch(err) {
        console.error(err)
    }
}

function readFileContent(path) {
    return new Promise((resolve, reject) => {
        if(fs.existsSync(path)) {
            resolve(fs.readFileSync(path))
        }
        reject(`File ${path} not found`)
    })
}