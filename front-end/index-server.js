const http = require('http')
const path = require('path')
const fs = require('fs')

const port = process.env.PORT || 8000

const mimeTypes = {
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  xml: 'application/xml',
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

const instFileRequest = url => !(/.+\..{1,4}$/).test(url)

const adjustUrl = url => !(/src/).test(url) ? `/src${url}` : url

function verifyUrl(url, isFetchSafe) {
  const isIndexOrNotSecure = url === '/' || !isFetchSafe || instFileRequest(url)
  const adjustedUrl = !isIndexOrNotSecure ? adjustUrl(url) : url
  const defaultPath = path.join('public', 'index.html')

  return isIndexOrNotSecure ? defaultPath : adjustedUrl
}

async function getFileContent(path) {
  const result = await readFileContent(path)

  return await result
}

function readFileContent(path) {
  return new Promise((resolve, reject) => {
    if(fs.existsSync(path)) {
      resolve(fs.readFileSync(path))
    }
    reject(`File ${path} not found`)
  })
}

function notFound(res) {
  res.writeHead(400)
  res.end()
}

const server = http.createServer(async (req, res) => {
  if(req.url === '/index-server.js') notFound(res)
  
  const secFetchSite = req.headers['sec-fetch-site']
  const isFetchSafe = (
    secFetchSite === 'none' || secFetchSite === 'same-origin'
  )

  const fileName = verifyUrl(req.url, isFetchSafe)
  const filePath = path.join(__dirname, fileName)

  const extension = fileName.split('.')[1]
  const contentType = mimeTypes[extension] || 'application/octet-stream'

  try {
    const fileContent = await getFileContent(filePath)

    if(fileContent) {
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(fileContent)
    }
  } catch(err) {
    console.error('index-server Error:', err)
  }

  notFound(res)
})

server.listen(
  port,
  () => {
    console.clear()
    console.log(`Server running on port ${port}`)
  }
)
